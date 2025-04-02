const Project = require('../models/Project');
const mongoose = require('mongoose');
const ProjectHistory = require('../models/ProjectHistory'); // Importez le modèle ProjectHistory

/**
 * Ajoute un nouvel historique de projet.
 * @param {string} projectId - L'ID du projet (ObjectId).
 * @param {string} changedBy - L'ID de l'utilisateur qui a effectué le changement (ObjectId).
 * @param {string} changeType - Le type de changement (par exemple, 'Status Update', 'Progress Update').
 * @param {string} oldValue - L'ancienne valeur avant le changement.
 * @param {string} newValue - La nouvelle valeur après le changement.
 * @param {number} progress - Le pourcentage de progression (optionnel).
 * @returns {Promise<Object>} - Le nouvel historique de projet créé.
 */
const addProjectHistory = async (projectId, changedBy, changeType, oldValue, newValue, progress = 0) => {
    try {
        // Convertir les IDs en ObjectId
        const projectObjectId = new mongoose.Types.ObjectId(projectId);
        const changedByObjectId = new mongoose.Types.ObjectId(changedBy);

        // Créer un nouvel historique de projet
        const newHistory = new ProjectHistory({
            project_id: projectObjectId,
            changed_by: changedByObjectId,
            change_type: changeType,
            old_value: oldValue,
            new_value: newValue,
            progress: progress,
        });

        // Sauvegarder l'historique dans la base de données
        const savedHistory = await newHistory.save();
        return savedHistory;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'historique du projet :', error);
        throw error; // Propager l'erreur pour la gestion des erreurs globale
    }
};


// Fonction pour récupérer le nombre de projets par statut
const getProjectsByStatus = async () => {
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


const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}); // Récupère tous les projets
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
};

const getProjectsWithProgress = async (req, res) => {
    try {
        console.log('Fetching projects with progress...');
        
        // Récupérer tous les projets
        const allProjects = await Project.find({});
        console.log('Total projects in database:', allProjects.length);

        // Récupérer tous les historiques de projets
        const allHistories = await ProjectHistory.find({}).sort({ changed_at: -1 });
        console.log('Total histories:', allHistories.length);
        console.log('Sample history:', JSON.stringify(allHistories[0], null, 2));

        // Créer un map des derniers historiques par projet
        const latestHistories = new Map();
        allHistories.forEach(history => {
            try {
                if (history && history.project_id) {
                    const projectId = history.project_id.toString();
                    if (!latestHistories.has(projectId)) {
                        latestHistories.set(projectId, history);
                    }
                } else {
                    console.log('Skipping history entry:', history);
                }
            } catch (err) {
                console.error('Error processing history entry:', err);
                console.log('Problematic history entry:', history);
            }
        });

        console.log('Latest histories map size:', latestHistories.size);

        // Combiner les projets avec leur historique
        const projectsWithProgress = allProjects.map(project => {
            try {
                const projectId = project._id.toString();
                const history = latestHistories.get(projectId);

                return {
                    _id: project._id,
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    progress: history ? history.progress : 0,
                    updated_at: history ? history.changed_at : project.updated_at
                };
            } catch (err) {
                console.error('Error processing project:', err);
                console.log('Problematic project:', project);
                return null;
            }
        }).filter(project => project !== null); // Filtrer les projets null

        console.log('Projects with progress:', projectsWithProgress.length);
        res.status(200).json(projectsWithProgress);
    } catch (error) {
        console.error('Error fetching projects with progress:', error);
        res.status(500).json({ message: 'Failed to fetch projects with progress' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(projectId);

        // D'abord, vérifier si le projet existe dans la table Projects
        let project = await Project.findById(objectId);

        // Si le projet n'existe pas dans Projects, vérifier s'il a un historique
        if (!project) {
            const history = await ProjectHistory.findOne({ project_id: objectId });
            if (!history) {
                return res.status(404).json({ message: 'Project not found' });
            }
            
            // Créer un objet projet basé sur l'historique
            project = {
                _id: objectId,
                name: 'Project from History',
                description: 'Project details available from history',
                status: 'In Progress',
                created_at: history.changed_at,
                updated_at: history.changed_at
            };
        }

        // Récupérer l'historique le plus récent
        const latestHistory = await ProjectHistory.findOne({
            project_id: objectId,
            change_type: "Progress Update"
        }).sort({ changed_at: -1 });

        // Formater la réponse
        const response = {
            _id: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            progress: latestHistory ? latestHistory.progress : 0,
            updated_at: latestHistory ? latestHistory.changed_at : project.updated_at
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Failed to fetch project' });
    }
};

module.exports = { 
    addProjectHistory,
    getProjectsByStatus,
    getAllProjects,
    getProjectsWithProgress,
    getProjectById
};
