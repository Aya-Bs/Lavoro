const Project = require('../models/Project');
const mongoose = require('mongoose');
const ProjectHistory = require('../models/ProjectHistory'); // Chemin vers votre modèle ProjectHistory

// Insérer un document de test
const testProject = new Project({
    name: "Test Project",
    description: "This is a test project",
    budget: 1000,
    manager_id: "123e4567-e89b-12d3-a456-426614174000",
    team_id: "123e4567-e89b-12d3-a456-426614174001",
    start_date: new Date(),
    status: "Not Started"
});

testProject.save()
    .then(() => console.log('Test project inserted, collection created'))
    .catch(err => console.error('Error inserting test project:', err));

    mongoose.connect('mongodb://127.0.0.1:27017/lavoro', {
    

        useNewUrlParser: true,
        useUnifiedTopology: true,
    })


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




    