
const mongoose = require('mongoose');
const Task = require('../models/Task');

const TaskHistory = require('../models/TaskHistory');
const User = require('../models/user');
const Role = require('../models/role'); 

const ObjectId = mongoose.Types.ObjectId;

exports.getTasksByUser = async (req, res) => {
  try {
    console.log("Request user object:", req.user);
    console.log("Authenticated user ID:", req.user._id);
    
    const query = { assigned_to: req.user._id };
    console.log("Query:", query);

    // Récupérer les tâches sans populate pour éviter l'erreur
    const tasks = await Task.find(query).lean();

    console.log("Found tasks:", tasks);
    
    if (!tasks.length) {
      console.log("No tasks found for user:", req.user._id);
      return res.status(200).json([]);
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

exports.seedTasks = async () => {
    try {
        await Task.deleteMany(); // Supprime toutes les tâches existantes pour éviter les doublons

        const tasks = [
            {
                _id: new mongoose.Types.ObjectId(),
                title: 'Créer une API REST',
                description: 'Développer une API REST pour gérer les utilisateurs.',
                project_id: new mongoose.Types.ObjectId(),
                assigned_to: userId, // Assignation au user Sarra Sahli
                status: 'Not Started',
                priority: 'High',
                deadline: new Date('2024-03-15'),
                start_date: new Date(),
                estimated_duration: 10, // en heures
                tags: ['API', 'Backend']
            },
            {
                _id: new mongoose.Types.ObjectId(),
                title: 'Développer une interface utilisateur',
                description: 'Créer une interface utilisateur en Angular.',
                project_id: new mongoose.Types.ObjectId(),
                assigned_to: userId, // Assignation au user Sarra Sahli
                status: 'In Progress',
                priority: 'Medium',
                deadline: new Date('2024-04-01'),
                start_date: new Date(),
                estimated_duration: 20, // en heures
                tags: ['Frontend', 'UI/UX']
            }
        ];

        await Task.insertMany(tasks);
        console.log('Tâches insérées avec succès et assignées à Sarra Sahli !');
        mongoose.connection.close();
    } catch (error) {
        console.error('Erreur lors de l’insertion des tâches :', error);
    }
};

exports.seedTaskHistory = async () => {
    try {
        await TaskHistory.deleteMany(); // Supprime l'historique existant

        const tasks = await Task.find(); // Récupère les tâches insérées précédemment

        if (tasks.length === 0) {
            console.log('Aucune tâche trouvée. Exécute d’abord le script pour insérer les tâches.');
            return mongoose.connection.close();
        }

        const historyLogs = [
            {
                task_id: tasks[0]._id,
                changed_by: new mongoose.Types.ObjectId(),
                change_type: 'Status Update',
                old_value: 'Not Started',
                new_value: 'In Progress'
            },
            {
                task_id: tasks[0]._id,
                changed_by: new mongoose.Types.ObjectId(),
                change_type: 'Priority Change',
                old_value: 'High',
                new_value: 'Medium'
            },
            {
                task_id: tasks[1]._id,
                changed_by: new mongoose.Types.ObjectId(),
                change_type: 'Status Update',
                old_value: 'In Progress',
                new_value: 'Done'
            }
        ];

        await TaskHistory.insertMany(historyLogs);
        console.log('Historique inséré avec succès !');
        mongoose.connection.close();
    } catch (error) {
        console.error('Erreur lors de l’insertion de l’historique :', error);
    }
};


// Fonction pour récupérer les tâches assignées à un utilisateur spécifique
exports.getTasks = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Vérifier si l'ID utilisateur est valide
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // Rechercher les tâches assignées à l'utilisateur
        const tasks = await Task.find({ assignedTo: userId });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Le nouveau statut est requis" });
    }

    try {
      // 1. Récupérer la tâche actuelle avant modification
      const oldTask = await Task.findById(taskId);
      if (!oldTask) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      // 2. Vérifier que le statut est valide
      const validStatuses = ['Not Started', 'In Progress', 'Done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
      }

      // 3. Mettre à jour la tâche
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true, runValidators: true }
      );

      // 5. Système de points pour les employés (uniquement quand une tâche est marquée comme terminée)
      let pointsMessage = "";
      let completionType = "not_applicable";
      let hoursDifference = 0;
      let pointsEarned = 0;

      if (status === 'Done' && oldTask.assigned_to) {
        try {
          // Récupérer l'utilisateur assigné à la tâche
          const user = await User.findById(oldTask.assigned_to);

          if (user) {
            // Vérifier si la tâche a été terminée dans les délais
            const now = new Date();
            const deadline = oldTask.deadline;

            if (deadline && now <= deadline) {
              // Tâche terminée dans le délai
              pointsEarned += 1;

              // Vérifier si la tâche a été terminée avant la durée estimée
              if (oldTask.start_date && oldTask.estimated_duration) {
                const startDate = new Date(oldTask.start_date);
                const estimatedEndTime = new Date(startDate.getTime() + (oldTask.estimated_duration * 60 * 60 * 1000)); // Conversion en millisecondes

                // Calculer combien d'heures avant la durée estimée
                hoursDifference = Math.floor((estimatedEndTime - now) / (1000 * 60 * 60));

                if (hoursDifference > 0) {
                  // +1 point supplémentaire par heure d'avance (max +3 points)
                  const additionalPoints = Math.min(hoursDifference, 3);
                  pointsEarned += additionalPoints;
                  completionType = "early";
                } else {
                  completionType = "on_time";
                }
              } else {
                completionType = "on_time";
              }
            } else if (deadline && now > deadline) {
              // Tâche non terminée à temps
              pointsEarned = -1;
              completionType = "late";
              // Calculer le retard en heures (valeur négative)
              hoursDifference = -Math.floor((now - deadline) / (1000 * 60 * 60));
            }

            // Mettre à jour les points de l'utilisateur
            user.performancePoints = (user.performancePoints || 0) + pointsEarned;
            await user.save();

            pointsMessage = `Points attribués: ${pointsEarned}. Total des points: ${user.performancePoints}`;
          }
        } catch (pointsError) {
          console.error("Erreur lors de l'attribution des points:", pointsError);
          // Ne pas bloquer la mise à jour du statut si l'attribution des points échoue
        }
      }

      // 4. Enregistrer dans l'historique avec les informations de performance
      const historyEntry = new TaskHistory({
        task_id: taskId,
        changed_by: req.user._id,
        change_type: 'Status Update',
        old_value: oldTask.status,
        new_value: status,
        completion_type: completionType,
        hours_difference: hoursDifference,
        points_earned: pointsEarned
      });

      await historyEntry.save();

      res.status(200).json({
        message: "Statut mis à jour avec succès",
        task: updatedTask,
        history: historyEntry,
        pointsInfo: pointsMessage || undefined
      });

    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

// Fonction de test pour le système de points
exports.testPointsSystem = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer une tâche de test
    const now = new Date();
    const deadline = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Deadline dans 24h

    const testTask = new Task({
      title: 'Tâche de test pour le système de points',
      description: 'Cette tâche est créée pour tester le système de points.',
      project_id: new mongoose.Types.ObjectId(), // ID de projet fictif
      assigned_to: userId,
      status: 'In Progress',
      priority: 'Medium',
      deadline: deadline,
      start_date: now,
      estimated_duration: 2, // 2 heures
      tags: ['Test']
    });

    await testTask.save();

    // Récupérer les points actuels de l'utilisateur
    const initialPoints = user.performancePoints || 0;

    // Simuler la complétion de la tâche
    const completionTime = new Date(now.getTime() + (1 * 60 * 60 * 1000)); // Complété 1h après le début

    // Mettre à jour le statut de la tâche à "Done"
    testTask.status = 'Done';
    await testTask.save();

    // Calculer les points qui devraient être attribués
    let expectedPoints = 0;

    // Tâche terminée dans les délais (+1 point)
    if (completionTime <= deadline) {
      expectedPoints += 1;

      // Vérifier si la tâche a été terminée avant la durée estimée
      const estimatedEndTime = new Date(now.getTime() + (testTask.estimated_duration * 60 * 60 * 1000));
      const hoursDifference = Math.floor((estimatedEndTime - completionTime) / (1000 * 60 * 60));

      if (hoursDifference > 0) {
        // +1 point supplémentaire par heure d'avance (max +3 points)
        const additionalPoints = Math.min(hoursDifference, 3);
        expectedPoints += additionalPoints;
      }
    } else {
      // Tâche non terminée à temps (-1 point)
      expectedPoints = -1;
    }

    // Mettre à jour manuellement les points de l'utilisateur pour le test
    user.performancePoints = initialPoints + expectedPoints;
    await user.save();

    // Créer une entrée dans l'historique
    const historyEntry = new TaskHistory({
      task_id: testTask._id,
      changed_by: userId,
      change_type: 'Status Update',
      old_value: 'In Progress',
      new_value: 'Done'
    });

    await historyEntry.save();

    res.status(200).json({
      message: "Test du système de points effectué avec succès",
      task: testTask,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        initialPoints: initialPoints,
        pointsEarned: expectedPoints,
        totalPoints: user.performancePoints
      },
      pointsCalculation: {
        taskCompletedOnTime: completionTime <= deadline,
        estimatedDuration: testTask.estimated_duration,
        actualDuration: 1, // 1 heure dans notre simulation
        hoursAhead: testTask.estimated_duration - 1
      }
    });

  } catch (error) {
    console.error("Erreur lors du test du système de points:", error);
    res.status(500).json({
      message: "Erreur serveur lors du test",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};






// exports.getTasksList = async (req, res) => {
//     try {
//       console.log("User ID from params:", req.params.userId); // Debug

//         const tasks = await Task.find({assigned_to: req.params.userId })
//         res.status(200).json({
//             success: true,
//             count: tasks.length,
//             data: tasks
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server Error',
//             error: error.message
//         });
//     }
// };




// exports.updateTaskCalendarDates = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { start, end } = req.body;

//     // Si start et end sont null, supprimer complètement calendar_dates
//     if (start === null && end === null) {
//       const updatedTask = await Task.findByIdAndUpdate(
//         taskId,
//         { $unset: { calendar_dates: 1 } },
//         { new: true }
//       );
//       return res.status(200).json({ success: true, data: updatedTask });
//     }

//     // Sinon, faire la mise à jour normale
//     const updateData = {};
//     if (start !== undefined) updateData['calendar_dates.start'] = start;
//     if (end !== undefined) updateData['calendar_dates.end'] = end;

//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({ success: true, data: updatedTask });
//   } catch (error) {
//     console.error("Error updating calendar dates:", error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//       details: error.message
//     });
//   }
// };





exports.getTasksList = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupérer l'utilisateur avec son rôle peuplé
    const user = await User.findById(userId).populate('role');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Récupérer les rôles une seule fois
    const [teamManager, developer] = await Promise.all([
      Role.findOne({ RoleName: 'Team Manager' }),
      Role.findOne({ RoleName: 'Developer' })
    ]);

    console.log("User role:", user.role._id);
    console.log("Team Manager ID:", teamManager._id);
    console.log("Developer ID:", developer._id);

    let tasks;
    console.log("User ID:", userId);
    
    if (user.role.equals(teamManager._id)) {
      tasks = await Task.find({ created_by: userId });
    } else if (user.role.equals(developer._id)) {
      tasks = await Task.find({ assigned_to: userId });
      console.log("Tasks for developer:", tasks);
    } else {
      // Rôle non reconnu
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized role',
        details: {
          userRole: user.role._id,
          allowedRoles: [teamManager._id, developer._id]
        }
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error("Error in getTasksList:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateTaskCalendarDates = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { start, end ,userId} = req.body;
    const user = await User.findById(userId);
    const team_manager = await Role.findOne({ RoleName: 'Team Manager' });
    const developer = await Role.findOne({ RoleName: 'Developer' });


    console.log("User ID from params:", userId); // Debug
    console.log("User :", user);
    

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const task = await Task.findById(taskId);
    console.log("Task :", task);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Vérifier les permissions
    if (user.role.equals(developer._id) && task.assigned_to.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    if (user.role.equals(team_manager._id) && task.created_by.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    let updateData = {};
    
    if (user.role.equals(team_manager._id)) {
      // Mise à jour des dates principales pour les managers
      if (start !== undefined) updateData.start_date = start;
      if (end !== undefined) updateData.deadline = end;
    } else if (user.role.equals(developer._id)) {
      // Mise à jour des dates du calendrier pour les développeurs
      if (start === null && end === null) {
        // Supprimer les dates du calendrier
        updateData = { $unset: { calendar_dates: 1 } };
      } else {
        // Mettre à jour les dates du calendrier
        updateData = { $set: {} };
        if (start !== undefined) updateData.$set['calendar_dates.start'] = start;
        if (end !== undefined) updateData.$set['calendar_dates.end'] = end;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("Error updating calendar dates:", error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};


exports.getTaskById = async (req, res) => {
  try {
      const taskId = req.params.id;

      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
          return res.status(400).json({
              success: false,
              message: "ID de tâche invalide"
          });
      }

      // Récupérer la tâche avec les informations du projet associé
      const task = await Task.findById(taskId)
          .populate('created_by', 'name email')
          .populate('assigned_to', 'name email');

      if (!task) {
          return res.status(404).json({
              success: false,
              message: "Tâche non trouvée"
          });
      }

      // Formater la réponse
      const response = {
          _id: task._id,
          taskTitle: task.title,
          description: task.description,  
          created_by: task.created_by,
          assigned_to: task.assigned_to ,
          status: task.status,
          priority: task.priority,
          deadline: task.deadline,
          start_date: task.start_date,
          estimated_duration: task.estimated_duration,
          tags: task.tags,
          requiredSkills: task.requiredSkills,
          created_at: task.created_at
      };

      res.status(200).json({
          success: true,
          data: response
      });
  } catch (error) {
      console.error("Erreur lors de la récupération de la tâche:", error);
      res.status(500).json({
          success: false,
          message: "Erreur serveur lors de la récupération de la tâche"
      });
  }
};