const express = require('express');
const mongoose = require('mongoose'); // Importez mongoose
const router = express.Router();
const ProjectHistory = require('../models/ProjectHistory'); // Importez le modèle ProjectHistory
const Project = require('../models/Project');
const ProjectController = require('../controllers/ProjectController');

// Routes pour les projets
router.get('/projetStatus', async (req, res) => {
    try {
        const projectsByStatus = await ProjectController.getProjectsByStatus();
        res.json(projectsByStatus);
    } catch (err) {
        console.error('Error in /projects-by-status route:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/projects', ProjectController.getAllProjects);

router.get('/project-history/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const objectId = new mongoose.Types.ObjectId(projectId);
        const history = await ProjectHistory.find({ project_id: objectId }).sort({ changed_at: -1 });

        if (!history || history.length === 0) {
            return res.status(404).json({ message: 'Aucun historique trouvé pour ce projet.' });
        }

        res.status(200).json(history);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique du projet :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/add-project-history', async (req, res) => {
    try {
        const { projectId, changedBy, changeType, oldValue, newValue, progress } = req.body;
        const history = await ProjectController.addProjectHistory(projectId, changedBy, changeType, oldValue, newValue, progress);
        res.status(201).json({ message: 'Historique de projet ajouté avec succès.', history });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'historique du projet :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/projects-with-progress', ProjectController.getProjectsWithProgress);

router.get('/project/:id', ProjectController.getProjectById);

module.exports = router;
