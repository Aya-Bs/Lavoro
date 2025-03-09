const mongo = require('mongoose');
const Schema = mongo.Schema;

const ProjectHistory = new Schema(
  {
    project_id: { type: mongo.Schema.Types.ObjectId, required: true }, // Use ObjectId here
    changed_by: { type: mongo.Schema.Types.ObjectId }, // Use ObjectId for user ID as well
    change_type: {
      type: String,
      enum: ['Status Update', 'Deadline Change', 'Description Update'],
      required: true,
    },
    old_value: { type: String, required: true },
    new_value: { type: String, required: true },
    changed_at: { type: Date, default: Date.now },
  }
);

module.exports = mongo.model('ProjectHistory', ProjectHistory);