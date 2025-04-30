const Meeting = require('../models/Meeting');
const User = require('../models/user');
const Role = require('../models/role');

// Créer une réunion
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, start_time, end_time, participants } = req.body;
        
        const meeting = new Meeting({
            organizer_id: req.user.id, // L'organisateur est l'utilisateur connecté
            title,
            description,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            participants
        });

        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les réunions
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate({
                path: 'participants',
                select: 'firstName lastName email'
            })
            .sort({ start_time: 1 });
        
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une réunion par ID
exports.getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate({
                path: 'participants',
                select: 'firstName lastName email'
            });
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }
        
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une réunion
exports.updateMeeting = async (req, res) => {
    try {
        const { title, description, start_time, end_time, participants } = req.body;
        
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                participants
            },
            { new: true }
        );
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }
        
        res.json(meeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une réunion
exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }
        
        res.json({ message: 'Réunion supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les utilisateurs et team managers pour le formulaire
exports.getUsersAndTeamManagers = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs
        const users = await User.find({ is_active: true })
            .select('firstName lastName email role')
            .sort({ lastName: 1 });
        
        // Récupérer le rôle "Team Manager" (vous devez définir le hierarchyLevel approprié)
        const teamManagerRole = await Role.findOne({ hierarchyLevel: 2 }); // Par exemple, niveau 2 pour les managers
        
        // Filtrer les team managers
        const teamManagers = await User.find({ 
            role: teamManagerRole._id,
            is_active: true 
        }).select('firstName lastName email');
        
        res.json({
            users,
            teamManagers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};