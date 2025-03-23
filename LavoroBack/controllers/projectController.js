const Project = require('../models/Project');
const mongoose = require('mongoose');
const ProjectHistory = require('../models/ProjectHistory'); // Chemin vers votre modèle ProjectHistory
const Archive = require('../models/Archive'); // Chemin vers votre modèle Archive
const Role = require('../models/role');
const User = require('../models/user');



// Create un projet
exports.createProject = async (req, res) => {
  try {
      const project = new Project(req.body);
      await project.save();
      res.status(201).json(project);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// Récupérer un projet par ID
exports.getProjectById = async (req, res) => {
  try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: "Projet non trouvé" });
      res.status(200).json(project);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Récupérer un projet par son nom
exports.getProjectByName = async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ message: "Le nom du projet est requis" });
  }

  try {
    const project = await Project.find({ name: { $regex: searchQuery, $options: 'i' } });

    if (project.length === 0) {
      return res.status(404).json({ message: "Aucun projet trouvé avec ce nom" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Mettre à jour un projet
exports.updateProjects = async (req, res) => {
  try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!project) return res.status(404).json({ message: "Projet non trouvé" });
      res.status(200).json(project);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) return res.status(404).json({ message: "Projet non trouvé" });
      res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}


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


// Function to get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update a project and track changes
exports.updateProject = async (req, res) => {
    const { id } = req.params; // Project ID
    const updates = req.body; // Updated fields
  
    try {
      // Find the project
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Track changes
      const changes = [];
      for (const field in updates) {
        if (project[field] !== updates[field]) {
          changes.push({
            field,
            oldValue: project[field],
            newValue: updates[field],
          });
        }
      }
  
      // If there are changes, save them to ProjectHistory
      if (changes.length > 0) {
        for (const change of changes) {
          const history = new ProjectHistory({
            project_id: project._id, // Use project._id (ObjectId)
            change_type: getChangeType(change.field),
            old_value: change.oldValue,
            new_value: change.newValue,
            changed_at: new Date(),
          });
          await history.save();
        }
      }
  
      // Update the project
      Object.assign(project, updates);
      project.updated_at = new Date();
      await project.save();
  
      res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Helper function to determine the type of change
  function getChangeType(field) {
    switch (field) {
      case 'status':
        return 'Status Update';
      case 'end_date':
        return 'Deadline Change';
      case 'description':
        return 'Description Update';
      default:
        return 'Other Update';
    }
  }


  exports.getProjectHistory = async (req, res) => {
    const { id } = req.params; // Project ID
  
    try {
      // Find all history entries for the project
      const history = await ProjectHistory.find({ project_id: id });
      if (!history || history.length === 0) {
        return res.status(404).json({ message: 'No history found for this project' });
      }
  
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  // In your backend controller (e.g., projectController.js)
exports.getProjectById = async (req, res) => {
    const { id } = req.params; // Get the project ID from the URL
  
    try {
      const project = await Project.findById(id); // Fetch the project by ID
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(project); // Return the project details
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  exports.archiveProject = async (req, res) => {
    const { id } = req.params; // Get the project ID from the URL
  
    console.log(`Archiving project with ID: ${id}`); // Log the project ID
  
    try {
      // Find the project by ID
      const project = await Project.findById(id);
      if (!project) {
        console.log('Project not found'); // Log if project is not found
        return res.status(404).json({ message: 'Project not found' });
      }
  
      console.log('Project found:', project); // Log the project details
  
      // Capture the original status before updating
      const originalStatus = project.status;
  
      // Update the project's status to "Archived"
      project.status = 'Archived';
      await project.save();
  
      // Track the status change in ProjectHistory
      const history = new ProjectHistory({
        project_id: project._id, // Use project._id (ObjectId)
        change_type: 'Status Update',
        old_value: originalStatus, // Use the original status
        new_value: 'Archived', // New status
        changed_at: new Date(),
      });
      await history.save();
  
      console.log('Status change tracked in ProjectHistory:', history); // Log the history entry
  
      // Create a new archive entry with the original status
      const archive = new Archive({
        ...project.toObject(), // Copy all project fields
        originalStatus, // Store the original status
      });
      await archive.save();
  
      console.log('Project archived successfully:', archive); // Log the archived project
  
      // Delete the project from the projects collection
      await Project.findByIdAndDelete(id);
  
      console.log('Project deleted from projects collection'); // Log deletion
  
      res.status(200).json({ message: 'Project archived successfully', archive });
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


exports.getArchivedProjectById = async (req, res) => {
  const { id } = req.params; // Get the archive ID from the URL

  try {
    const archivedProject = await Archive.findById(id); // Fetch the archived project by ID
    if (!archivedProject) {
      return res.status(404).json({ message: 'Archived project not found' });
    }

    res.status(200).json(archivedProject); // Return the archived project details
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fonction qui vérifie si un utilisateur est un Team Manager
exports.checkTeamManager = async (id) => {
  try {
      const user = await User.findById(id);
      if (!user) {
          throw new Error('Utilisateur non trouvé');
      }

      const role = await Role.findById(user.role);
      if (!role) {
          throw new Error('Rôle non trouvé');
      }

      if (role.RoleName !== 'Team Manager') {
          throw new Error('L\'utilisateur n\'est pas un Team Manager');
      }

      return user;
  } catch (error) {
      throw error;
  }
};


// Fonction qui vérifie combien de projets un Team Manager a
exports.checkTeamManagerProjects = async (req, res) => {
  try {
      const user = await this.checkTeamManager(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const projects = await Project.find({ manager_id: req.params.id });

      if (projects.length >= 3) {
          return res.status(400).json({ message: 'Vous ne pouvez pas affecter plus de projets à ce Team Manager' });
      } else {
          return res.status(200).json({ message: 'Vous pouvez affecter des projets à ce Team Manager' });
      }
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};