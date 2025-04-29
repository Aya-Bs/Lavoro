// Import models from the index file
const { Team, Project, User } = require('../models');


exports.createTeam = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.name || !req.body.project_id) {
            return res.status(400).json({
                success: false,
                message: 'Team name and project ID are required'
            });
        }

        // Get the current user ID from session
        const managerId = req.session.user._id;
        if (!managerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Ensure manager is included in members
        const members = req.body.members || [];
        if (!members.includes(managerId)) {
            members.push(managerId);
        }

        // Create new team with current user as manager
        const team = new Team({
            name: req.body.name,
            manager_id: managerId, // Set current user as manager
            project_id: req.body.project_id,
            members: members,
            capacity: req.body.capacity || 0,
            description: req.body.description || '',
            tags: req.body.tags || [],
            color: req.body.color || '#3755e6' // Default color - primary blue
        });

        // Save team to database
        const savedTeam = await team.save();

        // Populate user details in the response
        const populatedTeam = await Team.findById(savedTeam._id)
            .populate('manager_id', 'name email')
            .populate('members', 'name email');

        // Return success response
        res.status(201).json({
            success: true,
            data: populatedTeam,
            message: 'Team created successfully'
        });

    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Team with this name already exists for this project'
            });
        }

        // Handle other errors
        console.error('Team creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating team'
        });
    }
};


exports.getAllTeams = async (req, res) => {
  try {
    // Get all teams with populated references
    const teams = await Team.find()
      .populate('manager_id', 'firstName lastName email') // Populate manager details
      .populate('project_id', 'name description') // Populate project details
      .populate('members', 'firstName lastName email') // Populate members
      .sort({ created_at: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
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
        message: 'Failed to fetch team',
        error: error.message
      });
    }
  };


  exports.updateTeam = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate required fields
      if (!updates.name) {
        return res.status(400).json({
          success: false,
          message: 'Team name is required'
        });
      }

      // Get existing team first
      const existingTeam = await Team.findById(id);
      if (!existingTeam) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }

      // Remove project_id from updates if present
      if (updates.hasOwnProperty('project_id')) {
        delete updates.project_id;
      }

      // Handle members array to prevent duplicates
      if (updates.members) {
        // Convert to Set to remove duplicates, then back to array
        const uniqueMembers = [...new Set(updates.members.map(m => m.toString()))];

        // Ensure manager is included (only once)
        const managerId = existingTeam.manager_id.toString();
        if (!uniqueMembers.includes(managerId)) {
          uniqueMembers.push(managerId);
        }

        updates.members = uniqueMembers;
      }

      // Add updated_at timestamp
      updates.updated_at = Date.now();

      // Find and update the team
      const team = await Team.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      )
      .populate({
        path: 'manager_id',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'project_id',
        select: 'name description'
      })
      .populate({
        path: 'members',
        select: 'firstName lastName email'
      });

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found after update'
        });
      }

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

      // Check if team exists
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      // Get user from session (same as createTeam)
      const userId = req.session.user._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Find user in database
      const user = await User.findById(userId).populate('role');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Authorization check - same logic as createTeam
      const isAdmin = user.role?.RoleName === 'Admin';
      const isTeamManager = user.role?.RoleName === 'Team Manager';
      const isTeamOwner = userId.toString() === team.manager_id.toString();

      if (!isAdmin && !isTeamManager && !isTeamOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this team'
        });
      }

      // Delete the team
      await Team.findByIdAndDelete(teamId);

      // Remove team reference from members
     /* if (team.members && team.members.length > 0) {
        await Member.updateMany(
          { _id: { $in: team.members } },
          { $pull: { teams: teamId } }
        );
      }*/

      // Remove team reference from project
      if (team.project_id) {
        await Project.findByIdAndUpdate(
          team.project_id,
          { $pull: { teams: teamId } }
        );
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
