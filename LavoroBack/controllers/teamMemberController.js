
const TeamMember = require('../models/teamMember');
const User = require('../models/user');
const Skills = require('../models/skills');
const mongoose = require('mongoose');

// exports.getTeamMemberById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const teamMember = await TeamMember.findById(id)
//       .populate('user_id')
//       .populate('skills');

//     if (!teamMember) {
//       return res.status(404).json({ success: false, message: 'Team member not found' });
//     }

//     // Construction de la réponse
//     const responseData = {
//       id: teamMember._id,
//       teamId: teamMember.team_id,
//       name: teamMember.user_id 
//         ? `${teamMember.user_id.firstName || ''} ${teamMember.user_id.lastName || ''}`.trim()
//         : 'Unknown',
//       role: teamMember.role,
//       email: teamMember.user_id?.email || '',
//       image: teamMember.user_id?.image || '',
//       phone: teamMember.user_id?.phone_number || '',
//       skills: teamMember.skills?.map(skill => ({
//         id: skill._id,
//         name: skill.name || 'Unnamed Skill',
//         description: skill.description || ''
//       })) || [],
//       performance_score: teamMember.performance_score,
//       completed_tasks_count: teamMember.completed_tasks_count,
//       joined_at: teamMember.joined_at
//     };

//     res.status(200).json({ success: true, data: responseData });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: error.message 
//     });
//   }
// };


exports.getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params; // Maintenant on utilise l'ID direct du User

    // Recherche le TeamMember par l'ID du User
    const teamMember = await TeamMember.findOne({ user_id: id })
      .populate('user_id')
      .populate('skills');

    if (!teamMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team member not found for this user ID' 
      });
    }

    // Construction de la réponse
    const responseData = {
      id: teamMember._id,
      teamId: teamMember.team_id,
      name: teamMember.user_id 
        ? `${teamMember.user_id.firstName || ''} ${teamMember.user_id.lastName || ''}`.trim()
        : 'Unknown',
      role: teamMember.role,
      email: teamMember.user_id?.email || '',
      image: teamMember.user_id?.image || '',
      phone: teamMember.user_id?.phone_number || '',
      skills: teamMember.skills?.map(skill => ({
        id: skill._id,
        name: skill.name || 'Unnamed Skill',
        description: skill.description || ''
      })) || [],
      performance_score: teamMember.performance_score,
      completed_tasks_count: teamMember.completed_tasks_count,
      joined_at: teamMember.joined_at
    };

    res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    console.error('Error fetching team member by user ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching team member',
      error: error.message 
    });
  }
};

exports.getTeamMembersByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    //   Récupère les membres de l'équipe avec les infos utilisateur et compétences
    const members = await TeamMember.find({ team_id: teamId })
      .populate('user_id', 'firstName lastName image')
      .populate('skills', 'name');

      if (!members) {
        return res.status(404).json({ success: false, message: 'Team members not found' });
      }

    // Formate la réponse
    const result = members.map(member => ({
      id: member._id,
      name: member.user_id ? `${member.user_id.firstName} ${member.user_id.lastName}` : 'Membre inconnu',
      image: member.user_id?.image || '',
      role: member.role,
      skills: member.skills?.map(s => s.name) || [],
      performance: member.performance_score,
      tasksCompleted: member.completed_tasks_count
    }));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des membres'
    });
  }
};


exports.addTeamMember = async (req, res) => {
    try {
        const { team_id, user_id, skills } = req.body;

        // Validation des données requises
        if (!team_id || !user_id || !skills || !Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: 'team_id, user_id et skills (tableau) sont requis'
            });
        }

        // Vérification si le membre existe déjà dans l'équipe
        const existingMember = await TeamMember.findOne({ 
            team_id: team_id, 
            user_id: user_id 
        });

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: 'Cet utilisateur est déjà membre de cette équipe'
            });
        }

        // Création du nouveau membre d'équipe
        const newTeamMember = new TeamMember({
            team_id: team_id,
            user_id: user_id,
            role: 'Developer', // Valeur par défaut, peut être modifiée
            skills: skills,
            performance_score: 0, // Valeurs par défaut
            completed_tasks_count: 0
        });

        // Sauvegarde dans la base de données
        const savedMember = await newTeamMember.save();

        res.status(201).json({
            success: true,
            message: 'Membre ajouté à l\'équipe avec succès',
            data: savedMember
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout du membre:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};



// In your backend controller
exports.getAllMemberTask = async (req, res) => {
  try {
    const members = await TeamMember.find({})
      .populate('user_id', 'firstName lastName image')
      .lean();
    
    // Filter out any invalid members
    const validMembers = members.filter(member => member?._id);
    
    res.status(200).json({
      success: true,
      data: validMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team members'
    });
  }
};



exports.getAllMembers = async (req, res) => {
  try {
    const members = await TeamMember.find()
      .populate('user_id', 'firstName lastName image')
      .populate('skills', 'name');

    if (!members) {
      return res.status(404).json({ success: false, message: 'No team members found' });
    }

    const result = members.map(member => ({
      id: member._id,
      name: member.user_id ? `${member.user_id.firstName} ${member.user_id.lastName}` : 'Unknown',
      image: member.user_id?.image || '',
      role: member.role,
      skills: member.skills?.map(s => s.name) || [],
      performance: member.performance_score,
      tasksCompleted: member.completed_tasks_count
    }));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team members'
    });
  }
};