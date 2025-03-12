const express = require('express');
const router = express.Router();

const { getProjectsByStatus } = require('../controllers/ProjectController'); // Importez la fonction du contrôleur
const Project = require('../models/Project');
const ProjectController = require('../controllers/ProjectController');



router.get('/archived-projects', ProjectController.getAllArchivedProjects);

router.get('/', ProjectController.getAllProjects);

router.get('/projetStatus', async (req, res) => {
    try {
        // Appeler la fonction du contrôleur
        const projectsByStatus = await getProjectsByStatus();
        res.json(projectsByStatus); // Renvoyer les résultats au format JSON
    } catch (err) {
        console.error('Error in /projects-by-status route:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', ProjectController.updateProject); // Add this route
router.get('/:id/history', ProjectController.getProjectHistory); // Add this route
router.get('/:id', ProjectController.getProjectById); // Add this route
router.post('/:id/archive', ProjectController.archiveProject);
router.post('/:id/unarchive', ProjectController.unarchiveProject);
router.delete('/archived-projects/:id', ProjectController.deleteArchivedProject);
router.get('/archived-projects/:id', ProjectController.getArchivedProjectById);

//check if the user is a team manager
router.get('/checkTeamManager/:id', ProjectController.checkTeamManager);
//check team manager projects
router.get('/checkTeamManagerProjects/:id', ProjectController.checkTeamManagerProjects);

module.exports = router;