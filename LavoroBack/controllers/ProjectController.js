const Project = require('../models/Project');
const mongoose = require('mongoose');
const ProjectHistory = require('../models/ProjectHistory'); // Chemin vers votre modèle ProjectHistory


// Fonction pour récupérer le nombre de projets par statut
exports.getProjectsByStatus = async () => {
    try {
        // Agrégation MongoDB pour compter les projets par statut
        const projectsByStatus = await Project.aggregate([
            {
                $group: {
                    _id: "$status", // Grouper par statut
                    count: { $sum: 1 } // Compter le nombre de projets dans chaque groupe
                }
            }
        ]);

        // Formater les résultats pour les rendre plus faciles à utiliser côté frontend
        const formattedResults = projectsByStatus.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        return formattedResults;
    } catch (err) {
        console.error('Error fetching projects by status:', err);
        throw err; // Propager l'erreur pour la gérer côté appelant
    }


};


exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}); // Récupère tous les projets
        res.status(200).json(projects);
    } catch (error) {
      console.error('Error archiving project:', error); // Log any errors
      res.status(500).json({ message: error.message });
    }
  };


exports.getAllArchivedProjects = async (req, res) => {
  try {
    const archivedProjects = await Archive.find({});
    if (!archivedProjects || archivedProjects.length === 0) {
      return res.status(404).json({ message: 'No archived projects found' });
    }
    res.status(200).json(archivedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.unarchiveProject = async (req, res) => {
//   const { id } = req.params; // Project ID

//   try {
//     // Find the archived project
//     const archivedProject = await Archive.findById(id);
//     if (!archivedProject) {
//       return res.status(404).json({ message: 'Archived project not found' });
//     }

//     // Create a new project in the Project collection
//     const project = new Project(archivedProject.toObject());
//     project.status = 'Completed'; // Update the status to "Completed"
//     project.updated_at = new Date(); // Update the updated_at field
//     await project.save();

//     // Track the unarchive action in ProjectHistory
//     const history = new ProjectHistory({
//       project_id: project._id,
//       change_type: 'Status Update',
//       old_value: 'Archived',
//       new_value: 'Completed',
//       changed_at: new Date(),
//     });
//     await history.save();

//     // Delete the project from the Archive collection
//     await Archive.findByIdAndDelete(id);

//     res.status(200).json({ message: 'Project unarchived successfully', project });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



exports.unarchiveProject = async (req, res) => {
  const { id } = req.params; // Project ID

  try {
    // Find the archived project
    const archivedProject = await Archive.findById(id);
    if (!archivedProject) {
      return res.status(404).json({ message: 'Archived project not found' });
    }

    // Create a new project in the Project collection
    const project = new Project(archivedProject.toObject());
    project.status = 'Completed'; // Update the status to "Completed"
    project.updated_at = new Date(); // Update the updated_at field
    await project.save();

    // Track the unarchive action in ProjectHistory
    const history = new ProjectHistory({
      project_id: project._id,
      change_type: 'Status Update',
      old_value: 'Archived', // The old value is "Archived"
      new_value: 'Unarchived', // Set the new value to "Unarchived"
      changed_at: new Date(),
    });
    await history.save();

    // Delete the project from the Archive collection
    await Archive.findByIdAndDelete(id);

    res.status(200).json({ message: 'Project unarchived successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteArchivedProject = async (req, res) => {
  const { id } = req.params; // Project ID

  try {
    // Find and delete the archived project
    const deletedProject = await Archive.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Archived project not found' });
    }

    res.status(200).json({ message: 'Archived project deleted successfully', deletedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};