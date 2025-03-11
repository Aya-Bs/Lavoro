const express = require('express');
const router = express.Router();

const { getProjectsByStatus } = require('../controllers/ProjectController'); // Importez la fonction du contrôleur
const Project = require('../models/Project');
const ProjectController = require('../controllers/ProjectController');


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
router.get('/projects', ProjectController.getAllProjects);


router.get('/archived-projects', projectController.getAllArchivedProjects);

router.get('/', projectController.getAllProjects);
router.put('/:id', projectController.updateProject); 
router.get('/:id/history', projectController.getProjectHistory); 
router.get('/:id', projectController.getProjectById); 
router.post('/:id/archive', projectController.archiveProject);
router.post('/:id/unarchive', projectController.unarchiveProject);
router.delete('/archived-projects/:id', projectController.deleteArchivedProject);

module.exports = router;

