const Project = require('../models/Project');
const mongoose = require('mongoose');
const ProjectHistory = require('../models/ProjectHistory'); // Chemin vers votre modèle ProjectHistory
const Archive = require('../models/Archive'); // Chemin vers votre modèle Archive
const Role = require('../models/role');
const User = require('../models/user');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/email');
const transporter = require('../utils/emailConfig'); // Import the email transporter


// Define the sendProjectAssignmentEmail function
const sendProjectAssignmentEmail = async (email, projectDetails) => {
  const mailOptions = {
    from: `LAVORO <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
    to: email,
    subject: `🚀 New Project Assigned: ${projectDetails.name} 🗂️`,
    text: `
      Hello 👋,

      A new project has been assigned to you! 🎉

      Here are the project details:
      - 📌 Title:  ${projectDetails.name}
      - 📝 Description: ${projectDetails.description}
      - 💰 Budget: ${projectDetails.budget}
      - 🏢 Client: ${projectDetails.client}
      - 📅 Start Date: ${projectDetails.start_date}
      - 🗓️ End Date: ${projectDetails.end_date}
      - ⚠️ Risk Level: ${projectDetails.risk_level}

      Please take a moment to review the details. ✔️

      Best regards,  
      The Project Management Team 💼
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! 🎉');
  } catch (error) {
    console.error('Error sending email: 😞', error);

  }
};





// Créer un projet
exports.createProject = async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      budget: req.body.budget || 0,
      team_id: req.body.team_id,
      client: req.body.client,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status || 'Not Started',
      risk_level: req.body.risk_level || 'Medium',
      tags: req.body.tags,
    });

    // Sauvegarder le projet dans la base de données
    await newProject.save();

    // Récupérer l'utilisateur (manager) associé au projet
    const manager = await User.findById(req.body.manager_id);  // Assurez-vous que `manager_id` est envoyé dans la requête

    // Vérifier si le manager existe
    if (!manager) {
      return res.status(404).json({ message: 'Manager non trouvé' });
    }

    // Appeler la fonction d'envoi d'email
    await sendProjectAssignmentEmail(manager.email, newProject);

    return res.status(201).json({ message: 'Projet créé avec succès et email envoyé', project: newProject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Récupérer tous les projets
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ created_at: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des projets",
            error: error.message 
        });
    }
};


// Récupérer un projet par ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération du projet",
            error: error.message 
        });
    }
};

// Mettre à jour un projet
exports.updateProjects = async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            updated_at: Date.now(),
            // Mise à jour des dates si nécessaire
            start_date: req.body.start_date ? new Date(req.body.start_date) : undefined,
            end_date: req.body.end_date ? new Date(req.body.end_date) : undefined
        };

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ 
            message: "Erreur lors de la mise à jour du projet",
            error: error.message 
        });
    }
};
// Récupérer un projet par son nom (exact match)
exports.getProjectByName = async (req, res) => {
  try {
      const { search } = req.query;
      
      if (!search || search.trim() === '') {
          return res.status(400).json({
              success: false,
              message: 'Search term is required'
          });
      }

      // Utilisation de la recherche full-text de MongoDB
      const projects = await Project.find(
          { $text: { $search: search } },
          { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(50);

      res.status(200).json({
          success: true,
          count: projects.length,
          data: projects
      });

  } catch (error) {
      console.error('Error searching projects:', error);
      res.status(500).json({
          success: false,
          message: 'Server error while searching projects',
          error: error.message
      });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        res.status(200).json({ message: "Projet supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la suppression du projet",
            error: error.message 
        });
    }
};

// Fonction pour compter les projets
exports.getProjectCount = async (req, res) => {
    try {
        const count = await Project.countDocuments(); // Compte les projets
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};



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



exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    // Populate the manager_id field with user details
    const project = await Project.findById(id).populate('manager_id');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project); // Return project with manager details
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
      })
    }
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
      const archivedProject = await Archive.findById(id).populate('manager_id'); // Fetch the archived project by ID
      if (!archivedProject) {
        return res.status(404).json({ message: 'Archived project not found' });
      }
  
      res.status(200).json(archivedProject); // Return the archived project details
    } catch (error) {

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




exports.updateProjects = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    console.log("Received updates:", updates); // Debug what's coming in

    const changes = [];
    for (const field in updates) {
      // Better comparison that handles different types
      const oldValue = project[field];
      const newValue = updates[field];
      
      // Special handling for dates
      if (field.includes('_date') && oldValue && newValue) {
        const oldDate = new Date(oldValue).getTime();
        const newDate = new Date(newValue).getTime();
        if (oldDate !== newDate) {
          changes.push({ field, oldValue, newValue });
        }
      } 
      // Special handling for ObjectIds
      else if ((field === 'manager_id' || field === 'team_id') && oldValue && newValue) {
        if (!oldValue.equals(newValue)) {
          changes.push({ field, oldValue, newValue });
        }
      }
      // Default comparison
      else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field, oldValue, newValue });
      }
    }

    console.log("Detected changes:", changes); // Debug before saving

    for (const change of changes) {
      const changeType = getChangeType(change.field);
      console.log(`Field: ${change.field}, Type: ${changeType}`); // Debug change type
      
      const history = new ProjectHistory({
        project_id: project._id,
        change_type: changeType,
        old_value: stringifyForHistory(change.oldValue),
        new_value: stringifyForHistory(change.newValue),
        changed_at: new Date(),
      });
      await history.save();
    }

    // Apply updates
    for (const field in updates) {
      project[field] = updates[field];
    }
    project.updated_at = new Date();
    
    await project.save();

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      message: "Server error during update",
      error: error.message,
      stack: error.stack
    });
  }
};

// Helper to properly stringify values for history
function stringifyForHistory(value) {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Improved change type detection
function getChangeType(field) {
  // Map all possible field names to their change types
  const fieldMap = {
    // Project fields
    name: 'ProjectName Updated',
    description: 'Description Update',
    budget: 'Budget Update',
    client: 'Client Updated',
    
    // Dates
    start_date: 'Start Date Change',
    end_date: 'Deadline Change',
    
    // Status/risk
    status: 'Status Update',
    risk_level: 'Risk Level Updated',
    
    // References
    manager_id: 'Manager Changed',
    team_id: 'Team Changed',
    
    // Other
    tags: 'Tags Updated'
  };

  return fieldMap[field] || 'Other Update';
}



exports.exportArchivedProjects = async (req, res) => {
  try {
    console.log("🔍 Fetching archived projects...");
    const archives = await Archive.find();
    
    if (!archives.length) {
      return res.status(404).json({ message: 'No archived projects found.' });
    }

    console.log("✅ Archived projects found:", archives.length);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Archived Projects');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Original Status', key: 'originalStatus', width: 20 },
      { header: 'Budget (TND)', key: 'budget', width: 15 },
      { header: 'Last Updated', key: 'updated_at', width: 20 }
    ];

    archives.forEach((archive) => {
      console.log("📌 Adding row:", archive.name);
      worksheet.addRow({
        name: archive.name,
        originalStatus: archive.originalStatus,
        budget: archive.budget,
        updated_at: archive.updated_at ? new Date(archive.updated_at).toLocaleDateString() : 'N/A',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=archived-projects.xlsx'
    );

    console.log("📤 Sending Excel file...");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Excel export error:', err);
    res.status(500).json({ message: 'Failed to export Excel file.', error: err.message });
  }
};




};

