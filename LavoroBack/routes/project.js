const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController'); 
// Adjust the path as necessary

router.get('/archived-projects', projectController.getAllArchivedProjects);

router.get('/', projectController.getAllProjects);
router.put('/:id', projectController.updateProject); // Add this route
router.get('/:id/history', projectController.getProjectHistory); // Add this route
router.get('/:id', projectController.getProjectById); // Add this route
router.post('/:id/archive', projectController.archiveProject);
router.post('/:id/unarchive', projectController.unarchiveProject);
router.delete('/archived-projects/:id', projectController.deleteArchivedProject);



module.exports = router;