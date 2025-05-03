
// Import models from the index file
const { Team, Project, User, Role } = require('../models');



exports.createTeam = async (req, res) => {
};


exports.getAllTeams = async (req, res) => {
};
exports.getTeamById = async (req, res) => {
  };


  exports.updateTeam = async (req, res) => {
  };

  exports.deleteTeam = async (req, res) => {
  };

  exports.searchTeams = async (req, res) => {
    try {
      const { status, project, tags, sort, page = 1, limit = 8 } = req.query;
      
      // Build the query
      const query = {};
      
      // Status filter
      if (status) {
        const statusArray = status.split(',');
        query.status = { $in: statusArray };
      }
      
      // Project filter
      if (project) {
        const projectArray = project.split(',');
        query.project_id = { $in: projectArray };
      }
      
      // Tags filter - using $all to match teams that have ALL selected tags
      if (tags) {
        const tagsArray = tags.split(',');
        query.tags = { $all: tagsArray };
      }
      
      // Sort options
      let sortOption = { createdAt: -1 }; // Default: newest first
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'name-asc') sortOption = { name: 1 };
      else if (sort === 'name-desc') sortOption = { name: -1 };
      
      // Pagination
      const skip = (page - 1) * limit;
      
      // Get teams with populated fields
      const teams = await Team.find(query)
        .populate('manager_id', 'firstName lastName email image')
        .populate('project_id', 'name description')
        .populate('members', 'firstName lastName role status')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
      
      // Count total teams for pagination
      const total = await Team.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: teams,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Team search error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search teams',
        error: error.message
      });
    }
  };



// Récupérer les stats des teams
exports.getTeamStats = async (req, res) => {
  try {
      const totalTeams = await Team.countDocuments();
      
      const teamsByProject = await Team.aggregate([
          { $group: { _id: "$project_id", count: { $sum: 1 } } },
          { $lookup: {
              from: "projects",
              localField: "_id",
              foreignField: "_id",
              as: "project"
          }},
          { $unwind: "$project" },
          { $project: { 
              projectName: "$project.name",
              count: 1,
              _id: 0
          }},
          { $sort: { count: -1 } }
      ]);

      res.status(200).json({
          success: true,
          data: {
              totalTeams,
              teamsByProject
          }
      });
  } catch (error) {
      console.error('Error fetching team stats:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to fetch team statistics'
      });
  }
};


exports.getProjectCountPerTeamManager = async (req, res) => {
  try {
    const result = await Project.aggregate([
      {
        $group: {
          _id: "$ProjectManager_id",
          projectCount: { $sum: 1 } // Compte le nombre de projets pour chaque gestionnaire
        }
      },
      {
        $project: {
          _id: 0, // On supprime l'ID du gestionnaire
          projectCount: 1 // On garde seulement le nombre de projets
        }
      }
    ]);

    // Si aucun projet n'est trouvé
    if (result.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    // Répondre uniquement avec le nombre total de projets
    res.status(200).json({ projectCount: result[0]?.projectCount || 0 });

  } catch (err) {
    console.error("Error while counting projects per Team Manager:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Member Controller avec pagination
exports.getMembersWithPagination = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const roleName = req.query.role; // Get the role name from query parameters (e.g., "Developer")

      const skip = (page - 1) * limit;

      // Build the query object
      const query = {};
      if (roleName) {
          // Find the role document with the given RoleName
          const roleDoc = await Role.findOne({ RoleName: roleName });
          if (!roleDoc) {
              return res.status(400).json({
                  success: false,
                  message: `Role '${roleName}' not found`
              });
          }
          query.role = roleDoc._id; // Use the role's ObjectId in the query
      }

      const [members, total] = await Promise.all([
          User.find(query)
              .select('firstName lastName email role status image')
              .populate('role', 'RoleName') // Populate the role field with RoleName
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(limit),
          User.countDocuments(query) // Count documents matching the query
      ]);

      res.status(200).json({
          success: true,
          data: {
              members,
              total,
              page,
              pages: Math.ceil(total / limit),
              limit
          }
      });
  } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to fetch members'
      });
  }
};

// Route pour compter les développeurs
exports.countDeveloper = async (req, res) => {
  const count = await Member.countDocuments({ 'role.RoleName': 'Developer' });
  res.json({ count });
};

// Route pour récupérer les développeurs avec pagination
exports.getDeveloper = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const developers = await Member.find({ 'role.RoleName': 'Developer' })
    .skip((page - 1) * limit)
    .limit(limit);
  const count = await Member.countDocuments({ 'role.RoleName': 'Developer' });
  res.json({
    data: developers,
    total: count,
    pages: Math.ceil(count / limit)
  });
};



