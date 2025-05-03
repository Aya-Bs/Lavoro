const Team = require('../models/team');
const Project = require('../models/Project');
const User = require('../models/user');
const Role = require('../models/role');

exports.createTeam = async (req, res) => {
  try {
    if (!req.body.name || !req.body.project_id) {
      return res.status(400).json({
        success: false,
        message: 'Team name and project ID are required'
      });
    }

    const managerId = req.session.user?._id;
    if (!managerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const members = req.body.members || [];
    if (!members.includes(managerId)) {
      members.push(managerId);
    }

    const team = new Team({
      name: req.body.name,
      manager_id: managerId,
      project_id: req.body.project_id,
      members: members,
      capacity: req.body.capacity || 0,
      description: req.body.description || '',
      tags: req.body.tags || [],
      color: req.body.color || '#3755e6'
    });

    const savedTeam = await team.save();

    const populatedTeam = await Team.findById(savedTeam._id)
      .populate('manager_id', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTeam,
      message: 'Team created successfully'
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Team with this name already exists for this project'
      });
    }

    console.error('Team creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating team'
    });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('manager_id', 'firstName lastName email')
      .populate('project_id', 'name description')
      .populate('members', 'firstName lastName email')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams'
    });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('manager_id', 'firstName lastName email image phone_number')
      .populate('project_id', 'name description')
      .populate('members', 'firstName lastName email image role')
      .populate('tags');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team'
    });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates.name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }

    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    if (updates.hasOwnProperty('project_id')) {
      delete updates.project_id;
    }

    if (updates.members) {
      const uniqueMembers = [...new Set(updates.members.map(m => m.toString()))];
      const managerId = existingTeam.manager_id.toString();
      if (!uniqueMembers.includes(managerId)) {
        uniqueMembers.push(managerId);
      }
      updates.members = uniqueMembers;
    }

    updates.updated_at = Date.now();

    const team = await Team.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })
      .populate('manager_id', 'firstName lastName email')
      .populate('project_id', 'name description')
      .populate('members', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: team,
      message: 'Team updated successfully'
    });

  } catch (error) {
    console.error('Team update error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Team with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating team'
    });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const userId = req.session.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isAdmin = user.role?.RoleName === 'Admin';
    const isTeamManager = user.role?.RoleName === 'Team Manager';
    const isTeamOwner = userId.toString() === team.manager_id.toString();

    if (!isAdmin && !isTeamManager && !isTeamOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this team'
      });
    }

    await Team.findByIdAndDelete(teamId);

    if (team.project_id) {
      await Project.findByIdAndUpdate(team.project_id, {
        $pull: { teams: teamId }
      });
    }

    res.json({ success: true, message: 'Team deleted successfully' });

  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.searchTeams = async (req, res) => {
  try {
    const { status, project, tags, sort, page = 1, limit = 8 } = req.query;

    const query = {};
    if (status) query.status = { $in: status.split(',') };
    if (project) query.project_id = { $in: project.split(',') };
    if (tags) query.tags = { $all: tags.split(',') };

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };
    else if (sort === 'name-desc') sortOption = { name: -1 };

    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      Team.find(query)
        .populate('manager_id', 'firstName lastName email image')
        .populate('project_id', 'name description')
        .populate('members', 'firstName lastName role status')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Team.countDocuments(query)
    ]);

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

exports.getTeamStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();

    const teamsByProject = await Team.aggregate([
      { $group: { _id: "$project_id", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" },
      {
        $project: {
          projectName: "$project.name",
          count: 1,
          _id: 0
        }
      },
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
          projectCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          projectCount: 1
        }
      }
    ]);

    res.status(200).json({ projectCount: result[0]?.projectCount || 0 });

  } catch (err) {
    console.error("Error while counting projects per Team Manager:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMembersWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const roleName = req.query.role;
    const skip = (page - 1) * limit;

    const query = {};
    if (roleName) {
      const roleDoc = await Role.findOne({ RoleName: roleName });
      if (!roleDoc) {
        return res.status(400).json({
          success: false,
          message: `Role '${roleName}' not found`
        });
      }
      query.role = roleDoc._id;
    }

    const [members, total] = await Promise.all([
      User.find(query)
        .select('firstName lastName email role status image')
        .populate('role', 'RoleName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: members,
      total,
      page,
      pages: Math.ceil(total / limit)
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


