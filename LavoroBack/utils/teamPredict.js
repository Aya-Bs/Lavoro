const { spawn } = require('child_process');
const path = require('path');

// Helper function to clamp values between min and max
function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function calculateAverageDuration(tasks) {
    if (!tasks || !tasks.length) return 3.5;
    const total = tasks.reduce((sum, t) => sum + (t.duration || 3.5), 0);
    return clampValue(total / tasks.length, 1.5, 5.0);
}

function calculateQualityScore(tasks) {
    if (!tasks || !tasks.length) return 80;
    const total = tasks.reduce((sum, t) => sum + (t.quality_rating || 80), 0);
    return clampValue(total / tasks.length, 50, 99);
}

function calculateDeadlineAdherence(tasks) {
    if (!tasks || !tasks.length) return 80;
    const onTime = tasks.filter(t => t.completed_on_time).length;
    return clampValue((onTime / tasks.length) * 100, 40, 100);
}

function calculateProductivity(tasks) {
    if (!tasks || !tasks.length) return 30.0;
    const raw = tasks.reduce((sum, t) => {
        const complexity = t.complexity || 5;
        const quality = t.quality_rating || 80;
        const duration = t.duration || 3.5;
        return sum + (complexity * quality) / duration;
    }, 0) / tasks.length;
    return clampValue(raw, 6.37, 66.0);
}

function calculateCompletionRate(tasks) {
    if (!tasks || !tasks.length) return 0.8;
    const completed = tasks.filter(t => t.completed_on_time).length;
    return clampValue(completed / tasks.length, 0.5882, 1.0);
}

async function predictPerformanceScore(memberId, TeamMember) {
    try {
        const member = await TeamMember.findById(memberId);
        if (!member) throw new Error('Team member not found');

        const tasks = member.tasks || [];
        
        // Calculate metrics properly
        const metrics = {
            experience_level: clampValue(member.experience_level || 1, 1, 3),
            total_tasks_completed: Math.max(tasks.length, 1),
            missed_deadlines: clampValue(
                tasks.filter(t => !t.completed_on_time).length,
                0,
                14
            ),
            average_task_duration: calculateAverageDuration(tasks),
            task_quality_score: calculateQualityScore(tasks),
            deadline_adherence: calculateDeadlineAdherence(tasks),
            task_efficiency: clampValue(member.task_efficiency || 0.7, 0.5, 1.0),
            completion_rate: calculateCompletionRate(tasks),
            productivity: calculateProductivity(tasks)
        };

        console.log('Calculated metrics:', metrics);

        const pythonProcess = spawn('python', [
            path.resolve(__dirname, '../ML/predict_score.py')
        ]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python debug:', data.toString());
        });

        return new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Python process exited with code ${code}`));
                }

                try {
                    const result = JSON.parse(stdout);
                    if (result.status === 'error' || result.error) {
                        reject(new Error(result.error || 'Prediction failed'));
                    } else {
                        resolve({
                            performance_score: result.performance_score,
                            metrics: metrics
                        });
                    }
                } catch (e) {
                    console.error('Failed to parse:', stdout);
                    reject(new Error(`Failed to parse Python output: ${e.message}`));
                }
            });

            pythonProcess.stdin.write(JSON.stringify(metrics));
            pythonProcess.stdin.end();
        });
    } catch (error) {
        console.error('Prediction failed:', error);
        throw error;
    }
}

module.exports = { 
    predictPerformanceScore,
    clampValue,
    calculateAverageDuration,
    calculateQualityScore,
    calculateDeadlineAdherence,
    calculateProductivity,
    calculateCompletionRate
};