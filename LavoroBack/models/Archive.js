const mongo = require('mongoose');
const Schema = mongo.Schema;

const Archive = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    budget: { type: Number, default: 0 },
    manager_id: { type: mongo.Schema.Types.ObjectId },
    team_id: { type: mongo.Schema.Types.ObjectId },
    start_date: { type: Date },
    end_date: { type: Date },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Archived'],
      default: 'Not Started',
    },
    originalStatus: String, // Store the original status here

    ai_predicted_completion: { type: Date },
    ai_predicted_description: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

  }
);

module.exports = mongo.model('Archive', Archive);