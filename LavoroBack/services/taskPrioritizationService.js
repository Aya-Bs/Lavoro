const { PythonShell } = require('python-shell');
const path = require('path');
const Task = require('../models/Task');
const NodeCache = require('node-cache');

// Cache des prédictions pour 10 secondes seulement (très court pour voir les changements rapidement)
const predictionCache = new NodeCache({ stdTTL: 10 });

class TaskPrioritizationService {
    constructor() {
        this.pythonShell = null;
        this.initPythonShell();
        this.setupTaskChangeListeners();
    }

    // Configurer les écouteurs pour les changements de tâches
    setupTaskChangeListeners() {
        try {
            // Écouter les événements de mise à jour du modèle Task
            const taskSchema = Task.schema;

            // Après chaque sauvegarde de tâche (création ou mise à jour)
            taskSchema.post('save', (doc) => {
                console.log(`Tâche modifiée (ID: ${doc._id}), vidage du cache de priorisation...`);
                this.clearAllCache();
            });

            // Après chaque suppression de tâche
            taskSchema.post('remove', (doc) => {
                console.log(`Tâche supprimée (ID: ${doc._id}), vidage du cache de priorisation...`);
                this.clearAllCache();
            });

            // Après chaque mise à jour en masse
            taskSchema.post('updateMany', () => {
                console.log('Mise à jour en masse de tâches, vidage du cache de priorisation...');
                this.clearAllCache();
            });

            console.log('Écouteurs de changements de tâches configurés avec succès');
        } catch (error) {
            console.error('Erreur lors de la configuration des écouteurs de changements:', error);
        }
    }

    initPythonShell() {
        try {
            this.pythonShell = new PythonShell('predict.py', {
                mode: 'json',
                pythonPath: 'python', // Utiliser Python global
                scriptPath: path.join(__dirname, '../ML_Prioritazing'),
                pythonOptions: ['-u']
            });

            this.pythonShell.on('error', (err) => {
                console.error('PythonShell Error:', err);
                this.reconnectPythonShell();
            });

            this.pythonShell.on('close', () => {
                console.log('PythonShell closed, reconnecting...');
                this.reconnectPythonShell();
            });

            console.log('TaskPrioritization PythonShell initialized successfully');
        } catch (err) {
            console.error('Failed to initialize TaskPrioritization PythonShell:', err);
        }
    }

    reconnectPythonShell() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            this.initPythonShell();
        }, 5000);
    }

    async predictTaskPriorities(tasks) {
        // Créer une clé de cache basée sur les IDs des tâches et leurs dates de mise à jour
        const cacheKey = JSON.stringify(
            tasks.map(t => ({
                id: t._id ? t._id.toString() : t.task_id || String(Math.random()),
                updated: t.updated_at || t.created_at || new Date().toISOString()
            }))
        );

        const cached = predictionCache.get(cacheKey);
        if (cached) return cached;

        return new Promise((resolve, reject) => {
            if (!this.pythonShell) {
                return reject(new Error('PythonShell not initialized'));
            }

            const timeout = setTimeout(() => {
                reject(new Error('Python prediction timeout'));
            }, 10000);

            // Préparer les données pour le modèle Python
            const tasksForPrediction = tasks.map(task => {
                // Créer un objet de base avec les propriétés obligatoires
                const taskData = {
                    task_id: task._id ? task._id.toString() : task.task_id || String(Math.random()),
                    title: task.title || 'Sans titre',
                    duration: task.estimated_duration || task.duration || 1, // Utiliser 1 comme valeur par défaut
                    deadline: task.deadline ? new Date(task.deadline).toISOString() : new Date().toISOString(),
                    importance: this.getPriorityValue(task.priority || 'Medium'), // Toujours calculer l'importance à partir de la priorité
                    priority: task.priority || 'Medium',
                    status: task.status || 'Not Started'
                };

                // Ajouter start_date uniquement si elle existe
                if (task.start_date) {
                    taskData.start_date = new Date(task.start_date).toISOString();
                }

                // Valider les données
                const validation = this.validateTaskData(taskData);
                if (!validation.isValid) {
                    console.warn(`Données de tâche incomplètes, ajout de valeurs par défaut pour: ${validation.missingProps.join(', ')}`);
                }

                return taskData;
            });

            this.pythonShell.send({
                tasks: tasksForPrediction
            });

            this.pythonShell.once('message', (message) => {
                clearTimeout(timeout);
                try {
                    if (message.error) {
                        console.error('Erreur Python:', message.error);
                        reject(new Error(message.error));
                        return;
                    }

                    // Vérifier que message est un tableau
                    if (!Array.isArray(message)) {
                        console.error('Format de réponse invalide:', message);
                        reject(new Error('Format de réponse invalide'));
                        return;
                    }

                    // Afficher les informations de débogage
                    console.log('Résultats de priorisation ML:');
                    message.forEach(task => {
                        console.log(`Tâche: ${task.title}`);
                        console.log(`  - Score ML brut: ${task.raw_priority_score?.toFixed(2) || 'N/A'}`);
                        console.log(`  - Score ML ajusté: ${task.priority_score?.toFixed(2) || 'N/A'}`);
                        console.log(`  - Priorité manuelle: ${task.priority}`);
                        console.log(`  - Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Non définie'}`);
                        console.log(`  - Date de début: ${task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Non définie'}`);
                        console.log(`  - Jours jusqu'à deadline: ${task.days_until_deadline}`);
                        console.log(`  - Durée estimée: ${task.estimated_duration || task.duration || 'Non définie'} jours`);
                        console.log(`  - Facteur d'ajustement: ${task.deadline_adjustment?.toFixed(2) || 'N/A'}`);
                        console.log(`  - Incohérence de dates: ${task.date_inconsistency ? 'OUI' : 'Non'}`);
                        console.log('-----------------------------------');
                    });

                    predictionCache.set(cacheKey, message);
                    resolve(message);
                } catch (error) {
                    console.error('Erreur lors du traitement de la réponse Python:', error);
                    console.error('Message reçu:', message);
                    reject(new Error(`Erreur lors du traitement de la réponse: ${error.message}`));
                }
            });

            // Gérer les erreurs de communication avec Python
            this.pythonShell.once('error', (error) => {
                clearTimeout(timeout);
                console.error('Erreur de communication avec Python:', error);
                reject(new Error(`Erreur de communication avec Python: ${error.message}`));
            });
        });
    }

    // Convertir la priorité textuelle en valeur numérique
    getPriorityValue(priority) {
        switch (priority) {
            case 'High': return 10;
            case 'Medium': return 5;
            case 'Low': return 1;
            default: return 5;
        }
    }

    // Vérifier si une tâche a toutes les propriétés requises pour le modèle ML
    validateTaskData(task) {
        const requiredProps = ['title', 'duration', 'deadline', 'priority', 'status'];
        const missingProps = requiredProps.filter(prop => !task[prop] && task[prop] !== 0);

        if (missingProps.length > 0) {
            console.warn(`Tâche incomplète (ID: ${task._id || task.task_id}), propriétés manquantes: ${missingProps.join(', ')}`);
        }

        return {
            isValid: missingProps.length === 0,
            missingProps
        };
    }

    // Récupérer et prioriser les tâches d'un utilisateur
    async getPrioritizedTasksForUser(userId) {
        try {
            // Récupérer toutes les tâches assignées à l'utilisateur qui ne sont pas terminées
            const tasks = await Task.find({
                assigned_to: userId,
                status: { $ne: 'Done' }
            }).lean();

            if (tasks.length === 0) {
                return [];
            }

            // Prédire les priorités
            const prioritizedTasks = await this.predictTaskPriorities(tasks);

            return prioritizedTasks;
        } catch (error) {
            console.error('Error in getPrioritizedTasksForUser:', error);
            throw error;
        }
    }

    // Récupérer et prioriser toutes les tâches d'un projet
    async getPrioritizedTasksForProject(projectId) {
        try {
            // Récupérer toutes les tâches du projet qui ne sont pas terminées
            const tasks = await Task.find({
                project_id: projectId,
                status: { $ne: 'Done' }
            }).lean();

            if (tasks.length === 0) {
                return [];
            }

            // Prédire les priorités
            const prioritizedTasks = await this.predictTaskPriorities(tasks);

            return prioritizedTasks;
        } catch (error) {
            console.error('Error in getPrioritizedTasksForProject:', error);
            throw error;
        }
    }

    // Vider le cache pour un utilisateur spécifique
    clearCacheForUser(userId) {
        // Comme nous ne pouvons pas facilement identifier les clés de cache spécifiques à un utilisateur,
        // nous vidons tout le cache pour être sûr
        predictionCache.flushAll();
        console.log(`Cache vidé pour l'utilisateur ${userId}`);
    }

    // Vider le cache pour un projet spécifique
    clearCacheForProject(projectId) {
        // Vider tout le cache
        predictionCache.flushAll();
        console.log(`Cache vidé pour le projet ${projectId}`);
    }

    // Vider tout le cache
    clearAllCache() {
        predictionCache.flushAll();
        console.log('Tout le cache de priorisation a été vidé');
    }
}

module.exports = new TaskPrioritizationService();
