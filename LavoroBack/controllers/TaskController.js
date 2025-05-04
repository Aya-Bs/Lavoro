
const mongoose = require('mongoose');
const Task = require('../models/Task');

const TaskHistory = require('../models/TaskHistory');
const User = require('../models/user');

const Project = require('../models/Project');
const TeamMember = require('../models/teamMember');


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
exports.getTasksByUser = async (req, res) => {
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


exports.addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      assigned_to,
      status,
      priority,
      deadline,
      start_date,
      estimated_duration,
      tags
    } = req.body;

    // Validate that project exists
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    // Validate that team member exists if assigned
    if (assigned_to) {
      const teamMember = await TeamMember.findById(assigned_to);
      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }
    }

    const newTask = new Task({
      title,
      description,
      project_id,
      assigned_to,
      status,
      priority,
      deadline,
      start_date,
      estimated_duration,
      tags
    });

    const savedTask = await newTask.save();

    // 1. Add task to project's tasks array
    await Project.findByIdAndUpdate(
      project_id,
      {
        $push: { tasks: savedTask._id },
        $inc: { total_tasks_count: 1 }
      },
      { new: true }
    );

    // 2. If assigned to a team member, add task to their tasks array
    if (assigned_to) {
      await TeamMember.findByIdAndUpdate(
        assigned_to,
        {
          $push: { tasks: savedTask._id }
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




// In your TaskController.js

exports.getAllTasks = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      status, 
      priority, 
      project_id, 
      assigned_to, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project_id) filter.project_id = project_id;
    if (assigned_to) filter.assigned_to = assigned_to;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get tasks with population and pagination
    const tasks = await Task.find(filter)
  .populate('project_id', 'name status')
  .populate({
    path: 'assigned_to',
    select: 'role', // Fields from TeamMember
    populate: {
      path: 'user_id',
      select: 'firstName lastName image' // Fields from User
    }
  })
  .skip(skip)
  .limit(parseInt(limit))
  .sort({ deadline: 1 });
    // Get total count for pagination info
    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        tasksPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// In your TaskController.js

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Find the task first to check status
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // 2. Check if task can be deleted (only "Not Started" status)
    if (task.status !== 'Not Started') {
      return res.status(400).json({
        success: false,
        message: 'Only tasks with "Not Started" status can be deleted'
      });
    }

    // 3. Remove task from project's tasks array
    await Project.findByIdAndUpdate(
      task.project_id,
      { $pull: { tasks: taskId }, $inc: { total_tasks_count: -1 } }
    );

    // 4. Remove task from assigned team member's tasks array (if assigned)
    if (task.assigned_to) {
      await TeamMember.updateMany(
        { _id: { $in: task.assigned_to } },
        { $pull: { tasks: taskId } }
      );
    }

    // 5. Delete the task
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



exports.assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { memberIds } = req.body;

    // Validate input
    if (!memberIds || !Array.isArray(memberIds)) {
      return res.status(400).json({
        success: false,
        message: 'memberIds must be an array'
      });
    }

    // Filter out invalid IDs
    const validMemberIds = memberIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validMemberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid team member IDs provided'
      });
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify all team members exist
    const existingMembers = await TeamMember.find({ 
      _id: { $in: validMemberIds } 
    }).populate('user_id', 'firstName lastName');

    if (existingMembers.length !== validMemberIds.length) {
      const foundIds = existingMembers.map(m => m._id.toString());
      const missingIds = validMemberIds.filter(id => !foundIds.includes(id.toString()));
      return res.status(404).json({
        success: false,
        message: `Team members not found: ${missingIds.join(', ')}`
      });
    }

    // Update the task with new assignments
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assigned_to: { $each: validMemberIds } } }, // Use $addToSet to avoid duplicates
      { new: true }
    ).populate({
      path: 'assigned_to',
      select: 'role user_id',
      populate: {
        path: 'user_id',
        select: 'firstName lastName image'
      }
    });

    // Add task to team members' task arrays
    await TeamMember.updateMany(
      { _id: { $in: validMemberIds } },
      { $addToSet: { tasks: taskId } }
    );

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: updatedTask
    });

  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.unassignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { memberIds } = req.body;

    // Validate input
    if (!memberIds || !Array.isArray(memberIds)) {
      return res.status(400).json({
        success: false,
        message: 'memberIds must be an array'
      });
    }

    // Filter out invalid IDs
    const validMemberIds = memberIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validMemberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid team member IDs provided'
      });
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update the task by removing the members
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { assigned_to: { $in: validMemberIds } } },
      { new: true }
    ).populate({
      path: 'assigned_to',
      select: 'role user_id',
      populate: {
        path: 'user_id',
        select: 'firstName lastName image'
      }
    });

    // Remove task from team members' task arrays
    await TeamMember.updateMany(
      { _id: { $in: validMemberIds } },
      { $pull: { tasks: taskId } }
    );

    res.status(200).json({
      success: true,
      message: 'Members unassigned successfully',
      data: updatedTask
    });

  } catch (error) {
    console.error('Error unassigning task:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(taskId)
      .populate({
        path: 'assigned_to',
        select: 'role user_id',
        populate: {
          path: 'user_id',
          select: 'firstName lastName email image'
        }
      })
      .populate({
        path: 'project_id',
        select: 'name description ProjectManager_id budget client start_date end_date priority status risk_level tasks manager_id',
        populate: [
          {
            path: 'ProjectManager_id',
            select: 'firstName lastName email image'
          },
          {
            path: 'manager_id',
            select: 'firstName lastName email image'
          }
        ]
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




exports.getMyTasks = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const userId = req.user._id;
    
    // First find all team members where this user is the user_id
    const teamMembers = await TeamMember.find({ user_id: userId });
    
    // Extract the team member IDs
    const teamMemberIds = teamMembers.map(member => member._id);
    
    // Find tasks assigned to any of these team member IDs
    const tasks = await Task.find({ 
      assigned_to: { $in: teamMemberIds } 
    })
    .populate('project_id', 'name status')
    .populate({
      path: 'assigned_to',
      select: 'role user_id',
      populate: {
        path: 'user_id',
        select: 'firstName lastName image'
      }
    })
    .sort({ deadline: 1 });

    // Calculate counts for different statuses
    const today = new Date().toISOString().split('T')[0];
    const counts = {
      all: tasks.length,
      done: tasks.filter(t => t.status === 'Done').length,
      today: tasks.filter(t => 
        t.deadline && new Date(t.deadline).toISOString().split('T')[0] === today
      ).length,
      starred: tasks.filter(t => t.priority === 'High').length
    };

    res.status(200).json({
      success: true,
      data: tasks,
      counts // Include the counts in the response
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




// Helper function to calculate task score
const calculateTaskScore = (task, oldTask) => {
  let score = oldTask?.score || 0;
  
  // Check if status changed to "In Progress"
  if (task.status === 'In Progress' && (!oldTask || oldTask.status !== 'In Progress')) {
    if (task.start_date) {
      const startDate = new Date(task.start_date);
      const actualStartDate = new Date();
      const timeDiff = actualStartDate - startDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 0) {
        score += 2; // Started early
      } else if (daysDiff === 0) {
        score += 1; // Started on time
      } else {
        score -= 1; // Started late
      }
    } else {
      score += 1; // No start date specified
    }
  }
  
  // Check if status changed to "Done"
  if (task.status === 'Done' && task.deadline && 
      (!oldTask || oldTask.status !== 'Done')) {
    const deadlineDate = new Date(task.deadline);
    const completionDate = new Date();
    const timeDiff = completionDate - deadlineDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < -1) {
      score += 2;
    } else if (daysDiff === 0) {
      score += 1;
    } else if (daysDiff > 0) {
      score -= 1;
    } else if (daysDiff === -1) {
      score += 1.5;
    }
    
    // Priority bonus
    switch(task.priority) {
      case 'High': score += 3; break;
      case 'Medium': score += 2; break;
      case 'Low': score += 1; break;
      default: break;
    }
  }
  
  return score;
};

// Update your startTask controller
exports.startTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const oldTask = await Task.findById(taskId);
    if (!oldTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (oldTask.status !== 'Not Started') {
      return res.status(400).json({ message: 'Task must be in "Not Started" status' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { 
        status: 'In Progress',
        start_date: new Date() // Set actual start date
      },
      { new: true }
    );

    // Calculate and update score
    updatedTask.score = calculateTaskScore(updatedTask, oldTask);
    await updatedTask.save();

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update your completeTask controller
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const oldTask = await Task.findById(taskId);
    if (!oldTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (oldTask.status !== 'In Progress') {
      return res.status(400).json({ message: 'Task must be in "In Progress" status' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: 'Done' },
      { new: true }
    );

    // Calculate and update score
    updatedTask.score = calculateTaskScore(updatedTask, oldTask);
    await updatedTask.save();

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};





