// // const TeamMember = require('../models/teamMember');
// // const PredictMember = require('../models/PredictMember');


// // const express = require('express');

// // const router = express.Router();

// // const { predictPerformanceScore } = require('../utils/teamPredict');


// // router.get('/predict/:id', async (req, res) => {
// //     try {
// //         const memberId = req.params.id;
// //         const teamMember = await TeamMember.findById(memberId);
// //         if (!teamMember) {
// //             return res.status(404).json({ 
// //                 success: false,
// //                 error: 'Team member not found' 
// //             });
// //         }
        
// //         const predictions = await predictPerformanceScore(memberId);
        
// //         // Update PredictMember with comprehensive data
// //         const updatedPredictMember = await PredictMember.findOneAndUpdate(
// //             { user_id: teamMember.user_id },
// //             { 
// //                 $set: { 
// //                     ...predictions,
// //                     team_id: teamMember.team_id,
// //                     role: teamMember.role,
// //                     skills: teamMember.skills,
// //                     tasks: teamMember.tasks,  // Include actual tasks
// //                     metrics: {  // Store both raw and calculated metrics
// //                         raw: {
// //                             experience_level: teamMember.experience_level,
// //                             total_tasks_completed: teamMember.tasks.length,
// //                             missed_deadlines: teamMember.tasks.filter(t => !t.completed_on_time).length,
// //                             average_task_duration: calculateAverageDuration(teamMember.tasks),
// //                             task_quality_score: calculateQualityScore(teamMember.tasks),
// //                             deadline_adherence: calculateDeadlineAdherence(teamMember.tasks),
// //                             completion_rate: calculateCompletionRate(teamMember.tasks),
// //                             productivity: calculateProductivity(teamMember.tasks)
// //                         },
// //                         predicted: predictions
// //                     }
// //                 }
// //             },
// //             { upsert: true, new: true, setDefaultsOnInsert: true }
// //         );

// //         res.json({
// //             success: true,
// //             predictions,
// //             updated_predict_member: updatedPredictMember
// //         });
// //     } catch (error) {
// //         console.error('Prediction Error:', error);
// //         res.status(500).json({ 
// //             success: false,
// //             error: error.message 
// //         });
// //     }
// // });

// // function calculateAverageDuration(tasks) {
// //     if (!tasks || tasks.length === 0) return 3.0; // Default average
// //     const totalDuration = tasks.reduce((sum, task) => sum + (task.duration || 3.5), 0);
// //     return clampValue(totalDuration / tasks.length, 1.5, 5.0);
// // }

// // function calculateQualityScore(tasks) {
// //     if (!tasks || tasks.length === 0) return 80; // Default quality
// //     const totalQuality = tasks.reduce((sum, task) => sum + (task.quality_rating || 80), 0);
// //     return clampValue(totalQuality / tasks.length, 50, 99);
// // }



// // function calculateCompletionRate(tasks) {
// //     if (!tasks || tasks.length === 0) return 0.9;
// //     const completed = tasks.filter(t => t.completed_on_time).length;
// //     return clampValue(completed / tasks.length, 0.5882, 1.0);
// // }


// // function calculateProductivity(tasks) {
// //     if (!tasks || tasks.length === 0) return 30.0; // Default mid-range
    
// //     const rawProductivity = tasks.reduce((sum, task) => {
// //         const complexity = task.complexity || 5;
// //         const quality = task.quality_rating || 80;
// //         const duration = task.duration || 3.5;
// //         return sum + (complexity * quality) / duration;
// //     }, 0) / tasks.length;
    
// //     return clampValue(rawProductivity, 6.37, 66.0);
// // }


// // function clampValue(value, min, max) {
// //     return Math.min(Math.max(value, min), max);
// // }


// // function calculateDeadlineAdherence(tasks) {
// //     if (!tasks || tasks.length === 0) return 50;
// //     const onTimeTasks = tasks.filter(t => t.completed_on_time).length;
// //     return Math.round((onTimeTasks / tasks.length) * 100);
// // }

// // function calculateProductivity(tasks) {
// //     if (!tasks || tasks.length === 0) return 10;
// //     return tasks.reduce((sum, t) => sum + (t.complexity || 1) * (t.quality_rating || 50) / (t.duration || 1), 0) / tasks.length;
// // }



// //   module.exports = router;



// const express = require('express');
// const router = express.Router();
// const TeamMember = require('../models/teamMember');
// const PredictMember = require('../models/PredictMember');
// const { predictPerformanceScore } = require('../utils/teamPredict');

// // Helper function to calculate task efficiency
// function calculateTaskEfficiency(tasks) {
//     if (!tasks || !tasks.length) return 0.7;
//     const avgDuration = tasks.reduce((sum, t) => sum + (t.duration || 3.5), 0) / tasks.length;
//     const avgComplexity = tasks.reduce((sum, t) => sum + (t.complexity || 5), 0) / tasks.length;
//     return Math.min(Math.max(1 - (avgDuration / (avgComplexity * 0.8)), 0.5), 1.0);
// }

// router.get('/predict/:id', async (req, res) => {
//     try {
//         const member = await TeamMember.findById(req.params.id);
//         if (!member) {
//             return res.status(404).json({ 
//                 success: false,
//                 error: 'Team member not found' 
//             });
//         }

//         // Get prediction
//         const predictions = await predictPerformanceScore(req.params.id, TeamMember);
        
//         // Prepare update data
//         const updateData = {
//             team_id: member.team_id,
//             user_id: member.user_id,
//             role: member.role,
//             skills: member.skills,
//             tasks: member.tasks,
//             ...predictions.input_metrics,  // All the calculated metrics
//             performance_score: predictions.performance_score,
//             last_predicted: new Date(),
            
//             // Store additional calculated fields
//             task_efficiency: calculateTaskEfficiency(member.tasks),
            
//             // Store full metrics for reference
//             metrics: {
//                 raw: predictions.input_metrics,
//                 predicted: {
//                     performance_score: predictions.performance_score
//                 }
//             }
//         };

//         // Update or create PredictMember record
//         const updatedMember = await PredictMember.findOneAndUpdate(
//             { user_id: member.user_id },
//             { $set: updateData },
//             { upsert: true, new: true }
//         );

//         res.json({
//             success: true,
//             performance_score: predictions.performance_score,
//             metrics: predictions.input_metrics,
//             predict_member: updatedMember
//         });

//     } catch (error) {
//         console.error('Prediction error:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message,
//             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         });
//     }
// });



// router.get("/predict/:id", async (req, res) => {
//     const member = await teamMember.findById(req.params.id);
//     if (!member) return res.status(404).send("Member not found");
  
//     const python = spawn("python", [
//       "ML/predict_score.py",
//       JSON.stringify(member)
//     ]);
  
//     let output = "";
//     python.stdout.on("data", (data) => {
//       output += data.toString();
//     });
  
//     python.stderr.on("data", (data) => {
//       console.error(`stderr: ${data}`);
//     });
  
//     python.on("close", (code) => {
//       if (code !== 0) return res.status(500).send("Prediction failed");
//       res.send(JSON.parse(output));
//     });
//   });
  

const express = require("express");
const { spawn } = require("child_process");
const teamMember = require("../models/teamMember");
const PredictMember = require("../models/PredictMember"); // Import the PredictMember model
const User = require("../models/user");
const router = express.Router();



router.get("/predict-all", async (req, res) => {
    try {
        // Step 1: Fetch all team members with user details
        const members = await teamMember.find({})
            .populate({
                path: 'user_id',
                select: 'firstName lastName image',
                model: 'user' // Explicitly specify the model
            });
        
        if (!members.length) return res.status(404).send("No members found");

        // Step 2: Predict all members and handle potential undefined user
        const predictionResults = [];
        for (const member of members) {
            const prediction = await predictMember(member);
            
            // Safely handle user details
            const userDetails = member.user_id ? {
                name: `${member.user_id.firstName || ''} ${member.user_id.lastName || ''}`.trim(),
                image: member.user_id.image
            } : {
                name: 'Unknown User',
                image: ''
            };

            predictionResults.push({
                ...prediction,
                team_id: member.team_id,
                user_id: member.user_id ? member.user_id._id : null,
                user_details: userDetails,
                role: member.role,
                experience_level: member.experience_level,
                total_tasks_completed: member.total_tasks_completed,
            });

        }

        // Step 3: Sort by performance_score (descending)
        const sortedPredictions = predictionResults.sort((a, b) => 
            b.predicted_score - a.predicted_score
        );

        // Step 4: Clear existing predictions
        await PredictMember.deleteMany({});

        // Step 5: Save sorted predictions with rank
        const savePromises = sortedPredictions.map((prediction, index) => {
           return new PredictMember({
    team_id: prediction.team_id,
    user_id: prediction.user_id,
    user_name: prediction.user_details.name,
    user_image: prediction.user_details.image,
    experience_level: prediction.experience_level,  // This should be correct
    total_tasks_completed: prediction.total_tasks_completed,  // This should be correct
    role: prediction.role,
    productivity: prediction.predicted_productivity,
    performance_score: prediction.predicted_score,
    rank: index + 1,
    predicted_at: new Date()
}).save();

        });

        await Promise.all(savePromises);

        // Prepare response with top 3 members including user details
        const topThree = sortedPredictions.slice(0, 3).map(prediction => ({
            predicted_score: prediction.predicted_score,
            predicted_productivity: prediction.predicted_productivity,
            experience_level: prediction.experience_level, 
    total_tasks_completed: prediction.total_tasks_completed, 
    performance_score: prediction.performance_score, 
            user: {
                name: prediction.user_details.name,
                image: prediction.user_details.image
            },
            rank: sortedPredictions.indexOf(prediction) + 1
        }));

        res.send({
            message: `Successfully predicted and ranked ${members.length} members`,
            results: topThree
        });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).send("Internal server error");
    }
});


router.get("/all", async (_req, res) => {
    const members = await PredictMember.find({});
    return res.status(200).json({
        message: "All users fetched successfully",
        members: members
    });
});


// router.get("/predict-all", async (req, res) => {
//     try {
//         // Step 1: Fetch all team members with user details
//         const members = await teamMember.find({})
//             .populate({
//                 path: 'user_id',
//                 select: 'firstName lastName image'
//             });
        
//         if (!members.length) return res.status(404).send("No members found");

//         // Step 2: Predict all members
//         const predictionResults = [];
//         for (const member of members) {
//             const prediction = await predictMember(member);
//             predictionResults.push({
//                 ...prediction,
//                 team_id: member.team_id,
//                 user_id: member.user_id,
//                 user_details: {  // Include user information
//                     name: `${member.user_id.firstName} ${member.user_id.lastName}`,
//                     image: member.user_id.image
//                 },
//                 role: member.role
//             });
//         }

//         // Step 3: Sort by performance_score (descending)
//         const sortedPredictions = predictionResults.sort((a, b) => 
//             b.predicted_score - a.predicted_score
//         );

//         // Step 4: Clear existing predictions
//         await PredictMember.deleteMany({});

//         // Step 5: Save sorted predictions with rank
//         const savePromises = sortedPredictions.map((prediction, index) => {
//             return new PredictMember({
//                 team_id: prediction.team_id,
//                 user_id: prediction.user_id._id,
//                 user_name: prediction.user_details.name,
//                 user_image: prediction.user_details.image,
//                 role: prediction.role,
//                 productivity: prediction.predicted_productivity,
//                 performance_score: prediction.predicted_score,
//                 rank: index + 1,
//                 predicted_at: new Date()
//             }).save();
//         });

//         await Promise.all(savePromises);

//         // Prepare response with top 3 members including user details
//         const topThree = sortedPredictions.slice(0, 3).map(prediction => ({
//             predicted_score: prediction.predicted_score,
//             predicted_productivity: prediction.predicted_productivity,
//             user: {
//                 name: prediction.user_details.name,
//                 image: prediction.user_details.image
//             },
//             rank: sortedPredictions.indexOf(prediction) + 1
//         }));

//         res.send({
//             message: `Successfully predicted and ranked ${members.length} members`,
//             results: topThree
//         });

//     } catch (error) {
//         console.error("Prediction error:", error);
//         res.status(500).send("Internal server error");
//     }
// });

// router.get("/predict-all", async (req, res) => {
//     try {
//         const members = await teamMember.find({});
//         if (!members.length) return res.status(404).send("No members found");

//         // Step 1: Predict all members
//         const predictionResults = [];
//         for (const member of members) {
//             const prediction = await predictMember(member);
//             predictionResults.push({
//                 ...prediction,
//                 team_id: member.team_id,
//                 user_id: member.user_id,
//                 role: member.role
//             });
//         }

//         // Step 2: Sort by performance_score (descending)
//         const sortedPredictions = predictionResults.sort((a, b) => 
//             b.predicted_score - a.predicted_score
//         );

//         // Step 3: Clear existing predictions
//         await PredictMember.deleteMany({});

//         // Step 4: Save sorted predictions with rank
//         const savePromises = sortedPredictions.map((prediction, index) => {
//             return new PredictMember({
//                 team_id: prediction.team_id,
//                 user_id: prediction.user_id,
//                 role: prediction.role,
//                 productivity: prediction.predicted_productivity,
//                 performance_score: prediction.predicted_score,
//                 rank: index + 1,  // Add rank position (1st, 2nd, etc.)
//                 predicted_at: new Date()  // Add timestamp
//             }).save();
//         });

//         await Promise.all(savePromises);

//         res.send({
//             message: `Successfully predicted and ranked ${members.length} members`,
//             results: sortedPredictions.slice(0, 3)  // Return top 3 for display
//         });

//     } catch (error) {
//         console.error("Prediction error:", error);
//         res.status(500).send("Internal server error");
//     }
// });


// router.get("/predict-all", async (req, res) => {
//     try {
//         const members = await teamMember.find({});
//         if (!members.length) return res.status(404).send("No members found");

//         const predictionResults = [];
//         const savePromises = [];

//         for (const member of members) {
//             const prediction = await predictMember(member);
//             predictionResults.push(prediction);
            
//             // Save to database
//             savePromises.push(
//                 new PredictMember({
//                     team_id: member.team_id,
//                     user_id: member.user_id,
//                     role: member.role,
//                     productivity: prediction.predicted_productivity,
//                     performance_score: prediction.predicted_score
//                 }).save()
//             );
//         }

//         // Wait for all saves to complete
//         await Promise.all(savePromises);

//         res.send({
//             message: `Successfully predicted ${members.length} members`,
//             results: predictionResults
//         });

//     } catch (error) {
//         console.error("Prediction error:", error);
//         res.status(500).send("Internal server error");
//     }
// });

// Helper function to predict a single member
function predictMember(member) {
    return new Promise((resolve, reject) => {
        const python = spawn("python", [
            "ML/predict_score.py",
            JSON.stringify(member)
        ]);

        let output = "";
        python.stdout.on("data", (data) => output += data.toString());
        python.stderr.on("data", (data) => console.error(`stderr: ${data}`));
        
        python.on("close", (code) => {
            if (code !== 0) return reject("Prediction failed");
            resolve(JSON.parse(output));
        });
    });
}

router.get("/predict/:id", async (req, res) => {
    try {
        const member = await teamMember.findById(req.params.id);
        if (!member) return res.status(404).send("Member not found");

        const python = spawn("python", [
            "ML/predict_score.py",
            JSON.stringify(member)
        ]);

        let output = "";
        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        python.on("close", async (code) => {
            if (code !== 0) return res.status(500).send("Prediction failed");

            const predictionResult = JSON.parse(output);

            // Save prediction to PredictMember collection
            const newPrediction = new PredictMember({
                team_id: member.team_id, // Assuming team_id exists in the original member
                user_id: member.user_id,    // The ID of the team member
                role: member.role,      // Their role (e.g., 'Developer')
                productivity: predictionResult.predicted_productivity,
                performance_score: predictionResult.predicted_score
            });

            await newPrediction.save();

            // Send the prediction result back to the client
            res.send({
                ...predictionResult,
                savedToDatabase: true // Optional: Confirm it was saved
            });
        });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;

