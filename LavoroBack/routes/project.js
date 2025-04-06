const express = require('express');
const mongoose = require('mongoose'); // Importez mongoose
const router = express.Router();
const { getProjectsByStatus } = require('../controllers/ProjectController'); // Importez la fonction du contrôleur
const Project = require('../models/Project');
const ProjectController = require('../controllers/ProjectController');
const ProjectHistory = require('../models/ProjectHistory'); // Importez le modèle ProjectHistory

router.get('/archived-projects', ProjectController.getAllArchivedProjects);
router.get('/projects-with-progress', ProjectController.getProjectsWithProgress);
router.get('/', ProjectController.getAllProjects);
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

// Routes avec paramètres dynamiques
router.put('/:id', ProjectController.updateProject);
router.get('/:id/history', ProjectController.getProjectHistory);
router.get('/:id', ProjectController.getProjectById);
router.post('/:id/archive', ProjectController.archiveProject);
router.post('/:id/unarchive', ProjectController.unarchiveProject);
router.delete('/archived-projects/:id', ProjectController.deleteArchivedProject);
router.get('/archived-projects/:id', ProjectController.getArchivedProjectById);

//check if the user is a team manager
router.get('/checkTeamManager/:id', ProjectController.checkTeamManager);
//check team manager projects
router.get('/checkTeamManagerProjects/:id', ProjectController.checkTeamManagerProjects);

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

module.exports = router;