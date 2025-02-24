const mongoose = require('mongoose');
const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');


exports.seedTasks = async () => {
    try {
        await Task.deleteMany(); // Supprime toutes les tâches existantes pour éviter les doublons

        const tasks = [
            {
                _id: new mongoose.Types.ObjectId(),
                title: 'Créer une API REST',
                description: 'Développer une API REST pour gérer les utilisateurs.',
                project_id: new mongoose.Types.ObjectId(),
                assigned_to: new mongoose.Types.ObjectId(),
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
                assigned_to: new mongoose.Types.ObjectId(),
                status: 'In Progress',
                priority: 'Medium',
                deadline: new Date('2024-04-01'),
                start_date: new Date(),
                estimated_duration: 20, // en heures
                tags: ['Frontend', 'UI/UX']
            }
        ];

        await Task.insertMany(tasks);
        console.log('Tâches insérées avec succès !');
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

