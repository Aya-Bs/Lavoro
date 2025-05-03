const { PythonShell } = require('python-shell');
const path = require('path');
const Task = require('../models/Task');
const TeamMember = require('../models/teamMember');
const NodeCache = require('node-cache');

const predictionCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class TaskAssignmentService {
        // constructor() {
        //     this.pythonShell = null;
        //     this.pythonShellReady = false;
        //     this.initPythonShell();
        //     this.localSkillRelations = this.buildSkillRelations();
        // }

    buildSkillRelations() {
        return {
            // Frontend
            'css': {'html': 0.8, 'javascript': 0.6, 'react': 0.5, 'ui/ux design': 0.7, 'figma': 0.6},
            'html': {'css': 0.8, 'javascript': 0.7},
            'javascript': {'css': 0.6, 'react': 0.9, 'node.js': 0.8, 'api rest': 0.7, 'express': 0.6},
            'react': {'javascript': 0.9, 'redux': 0.7},
            
            // Backend
            'api rest': {'javascript': 0.8, 'node.js': 0.9, 'express': 0.8, 'python': 0.6},
            'node.js': {'javascript': 0.9, 'express': 0.9, 'api rest': 0.9},
            'express': {'node.js': 0.9, 'javascript': 0.8},
            
            // Autres
            'python': {'django': 0.8, 'flask': 0.8, 'pandas': 0.6},
            'java': {'spring': 0.8, 'hibernate': 0.7}
        };
    }

    async initPythonShell() {
        try {
            this.pythonShell = new PythonShell('predict.py', {
                mode: 'json',
                pythonPath: process.env.PYTHON_PATH || 'python3',
                scriptPath: path.join(__dirname, '../ml_model'),
                pythonOptions: ['-u']
            });

            this.pythonShell.on('error', (err) => {
                console.error('PythonShell Error:', err);
                this.pythonShellReady = false;
                this.reconnectPythonShell();
            });

            this.pythonShell.on('close', () => {
                console.warn('PythonShell closed, reconnecting...');
                this.pythonShellReady = false;
                this.reconnectPythonShell();
            });

            this.pythonShell.on('message', (message) => {
                if (message.ready) {
                    this.pythonShellReady = true;
                    console.log('PythonShell ready for predictions');
                }
            });

            console.log('PythonShell initialized successfully');
        } catch (err) {
            console.error('Failed to initialize PythonShell:', err);
            this.pythonShellReady = false;
            this.reconnectPythonShell();
        }
    }

    reconnectPythonShell() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            console.log('Attempting to reconnect PythonShell...');
            this.initPythonShell();
        }, 5000);
    }

    normalizeSkills(skills) {
        return skills.map(s => s.toLowerCase().trim());
    }

    async calculateLocalMatch(requiredSkills, memberSkills) {
        requiredSkills = this.normalizeSkills(requiredSkills);
        memberSkills = this.normalizeSkills(memberSkills);

        if (!requiredSkills || requiredSkills.length === 0) return 0;
        if (!memberSkills || memberSkills.length === 0) return 0;

        let totalScore = 0;
        let exactMatches = 0;

        for (const reqSkill of requiredSkills) {
            let maxSim = 0;
            
            // Check exact match first
            if (memberSkills.includes(reqSkill)) {
                exactMatches++;
                maxSim = 1.0;
            } else {
                // Check similar skills
                for (const memSkill of memberSkills) {
                    const directSim = this.localSkillRelations[reqSkill]?.[memSkill] || 0;
                    const reverseSim = this.localSkillRelations[memSkill]?.[reqSkill] || 0;
                    maxSim = Math.max(maxSim, directSim, reverseSim);
                }
            }
            totalScore += maxSim;
        }

        const baseScore = totalScore / requiredSkills.length;
        const multiSkillBonus = Math.min(exactMatches * 0.15, 0.3);
        return Math.min(baseScore + multiSkillBonus, 1.0);
    }

    async predictMatch(requiredSkills, memberSkills) {
        const cacheKey = JSON.stringify({
            req: [...requiredSkills].sort(),
            mem: [...memberSkills].sort()
        });
    
        const cached = predictionCache.get(cacheKey);
        if (cached) return cached;
    
        // First try local calculation
        const localScore = await this.calculateLocalMatch(requiredSkills, memberSkills);
        
        // If PythonShell is not ready, use local calculation
        if (!this.pythonShellReady) {
            const result = {
                match: true, // Toujours considérer comme match
                confidence: localScore,
                required_skills: requiredSkills,
                member_skills: memberSkills,
                source: 'local-fallback'
            };
            predictionCache.set(cacheKey, result);
            return result;
        }
    
        try {
            const result = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Python prediction timeout'));
                }, 10000);
    
                this.pythonShell.send({
                    required_skills: requiredSkills,
                    member_skills: memberSkills
                });
    
                this.pythonShell.once('message', (message) => {
                    clearTimeout(timeout);
                    if (message.error) {
                        reject(new Error(message.error));
                    } else {
                        // Combine with local score for better accuracy
                        const combinedConfidence = message.confidence * 0.6 + localScore * 0.4;
                        const finalResult = {
                            ...message,
                            confidence: combinedConfidence,
                            match: true, // Toujours considérer comme match
                            source: 'ml-model'
                        };
                        predictionCache.set(cacheKey, finalResult);
                        resolve(finalResult);
                    }
                });
            });
            return result;
        } catch (err) {
            console.error('Python prediction failed, using local calculation:', err);
            const result = {
                match: true, // Toujours considérer comme match
                confidence: localScore,
                required_skills: requiredSkills,
                member_skills: memberSkills,
                source: 'local-fallback'
            };
            predictionCache.set(cacheKey, result);
            return result;
        }
    }

    async findBestMatch(taskId, teamId) {
        try {
            const task = await Task.findById(taskId).lean();
            if (!task) throw new Error('Task not found');
    
            const teamMembers = await TeamMember.find({ team_id: teamId })
                .populate('skills', 'name -_id')
                .lean();
    
            if (!teamMembers || teamMembers.length === 0) {
                throw new Error('No team members found in this team');
            }
    
            const requiredSkills = task.requiredSkills || [];
            if (requiredSkills.length === 0) {
                throw new Error('Task has no required skills specified');
            }
    
            const membersWithScores = await Promise.all(
                teamMembers.map(async (member) => {
                    const memberSkills = (member.skills || []).map(s => s.name).filter(Boolean);
                    if (memberSkills.length === 0) {
                        return {
                            memberId: member._id,
                            userId: member.user_id,
                            score: 0,
                            skills: [],
                            matchDetails: {
                                match: false,
                                confidence: 0,
                                source: 'no-skills'
                            }
                        };
                    }
    
                    try {
                        const prediction = await this.predictMatch(requiredSkills, memberSkills);
                        return {
                            memberId: member._id,
                            userId: member.user_id,
                            score: prediction.confidence || 0,
                            skills: memberSkills,
                            matchDetails: prediction
                        };
                    } catch (err) {
                        console.error(`Prediction error for member ${member._id}:`, err);
                        return {
                            memberId: member._id,
                            userId: member.user_id,
                            score: 0,
                            skills: memberSkills,
                            error: err.message
                        };
                    }
                })
            );
    
            // Trier tous les membres par score (même ceux avec score faible)
            const sortedMembers = membersWithScores.sort((a, b) => b.score - a.score);
            
            // Le meilleur match est toujours le premier de la liste triée
            const bestMatch = sortedMembers[0] || null;
            const success = sortedMembers.length > 0;
    
            return {
                taskId: task._id,
                taskTitle: task.title,
                requiredSkills,
                bestMatch,
                allMatches: sortedMembers,
                success,
                message: success ? 
                    `Found ${sortedMembers.length} potential candidates` :
                    'No team members available'
            };
        } catch (error) {
            console.error('Error in findBestMatch:', error);
            return {
                success: false,
                error: error.message,
                taskId,
                teamId
            };
        }
    }

    async assignTaskToMember(taskId, memberId) {
        try {
            const task = await Task.findByIdAndUpdate(
                taskId,
                {
                    assigned_to: memberId,
                    status: 'In Progress',
                    start_date: new Date()
                },
                { new: true }
            );

            if (!task) {
                throw new Error('Task not found');
            }

            // Update team member stats
            await TeamMember.updateOne(
                { _id: memberId },
                { $inc: { total_tasks_completed: 1 } }
            );

            return {
                success: true,
                task,
                message: `Task "${task.title}" assigned successfully`
            };
        } catch (error) {
            console.error('Error assigning task:', error);
            throw error;
        }
    }
}

module.exports = new TaskAssignmentService();