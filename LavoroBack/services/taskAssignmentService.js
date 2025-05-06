const { PythonShell } = require('python-shell');
const path = require('path');
const mongoose = require('mongoose');
const { normalizeSkill } = require('../utils/skillUtils');
const Task = require('../models/Task');
const TeamMember = require('../models/teamMember');
const Skills = require('../models/skills');
const logger = require('../config/logger');

class TaskAssignmentService {
  constructor() {
    this.pythonOptions = {
      mode: 'json',
      pythonPath: process.env.PYTHON_PATH || 'python3',
      scriptPath: path.join(__dirname, '../ml_model'),
      pythonOptions: ['-u']
    };
    this.mlThreshold = parseFloat(process.env.ML_THRESHOLD) || 0.5;
    this.fallbackThreshold = parseFloat(process.env.FALLBACK_THRESHOLD) || 0.3;
  }

  /**
   * Normalise et compare les compétences avec fallback Jaccard
   */
  async evaluateMatch(requiredSkills, memberSkills) {
    try {
      const normRequired = requiredSkills.map(normalizeSkill).filter(Boolean);
      const normMember = memberSkills.map(normalizeSkill).filter(Boolean);

      // Essayer d'abord avec le modèle ML
      const mlResult = await this._predictWithML(normRequired, normMember);
      if (mlResult.confidence >= this.mlThreshold) {
        return mlResult;
      }

      // Fallback au calcul Jaccard
      const jaccardResult = this._calculateJaccard(normRequired, normMember);
      return {
        ...jaccardResult,
        usedFallback: true
      };
    } catch (error) {
      logger.error('Match evaluation failed:', error);
      return {
        match: false,
        confidence: 0,
        matchedSkills: [],
        error: 'Evaluation error'
      };
    }
  }

  /**
   * Trouve le meilleur match pour une tâche
   */
  async findBestMatch(taskId) {
    try {
      const task = await Task.findById(taskId).lean();
      if (!task) {
        throw new Error('Task not found');
      }

      const members = await TeamMember.find()
        .populate('skills', 'name')
        .lean();

      if (!members.length) {
        throw new Error('No team members available');
      }

      const evaluations = await Promise.all(
        members.map(async member => {
          const memberSkills = member.skills.map(s => s.name);
          const evaluation = await this.evaluateMatch(
            task.requiredSkills,
            memberSkills
          );

          return {
            memberId: member._id,
            ...evaluation,
            performanceScore: member.performance_score || 0,
            currentWorkload: member.tasks ? member.tasks.length : 0
          };
        })
      );

      // Classement selon plusieurs critères
      return evaluations
        .filter(e => e.match)
        .sort((a, b) => {
          // Priorité 1: Score de confiance
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          // Priorité 2: Performance historique
          if (b.performanceScore !== a.performanceScore) {
            return b.performanceScore - a.performanceScore;
          }
          // Priorité 3: Charge de travail actuelle
          return a.currentWorkload - b.currentWorkload;
        })[0] || null;
    } catch (error) {
      logger.error('Failed to find best match:', error);
      throw error;
    }
  }

  /**
   * Assigner une tâche à un membre
   */
  async assignTaskToMember(taskId, memberId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          $addToSet: { assigned_to: memberId },
          $set: { status: 'In Progress', start_date: new Date() }
        },
        { new: true, session }
      );

      await TeamMember.findByIdAndUpdate(
        memberId,
        { $addToSet: { tasks: taskId } },
        { session }
      );

      await session.commitTransaction();
      return task;
    } catch (error) {
      await session.abortTransaction();
      logger.error('Assignment failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Prédiction avec le modèle Python
   */
  async _predictWithML(requiredSkills, memberSkills) {
    return new Promise((resolve, reject) => {
      PythonShell.run(
        'predict.py',
        {
          ...this.pythonOptions,
          args: [
            JSON.stringify(requiredSkills),
            JSON.stringify(memberSkills)
          ]
        },
        (err, results) => {
          if (err) {
            logger.warn('ML prediction failed, using fallback');
            resolve(this._calculateJaccard(requiredSkills, memberSkills));
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  /**
   * Calcul de similarité Jaccard
   */
  _calculateJaccard(requiredSkills, memberSkills) {
    const reqSet = new Set(requiredSkills);
    const memSet = new Set(memberSkills);
    
    const intersection = [...reqSet].filter(s => memSet.has(s));
    const union = new Set([...reqSet, ...memSet]);
    
    const confidence = union.size > 0 ? intersection.length / union.size : 0;
    
    return {
      match: confidence >= this.fallbackThreshold,
      confidence,
      matchedSkills: intersection
    };
  }

  /**
   * Mettre à jour les scores de performance
   */
  async updatePerformanceScores() {
    // Implémentation optionnelle pour ajuster les scores
  }
}

module.exports = new TaskAssignmentService();