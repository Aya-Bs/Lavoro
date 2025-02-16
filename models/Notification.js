
const mongo = require('mongoose');
const Schema = mongo.Schema;

const Notification = new Schema(
    {
        notification_id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), unique: true },
        user_id: { type: String, required: true },
        notification_text: { type: String, required: true },
        type: { type: String, required: true },
        is_read: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        read_at: { type: Date },
        triggered_by: { type: String, required: true },
        updated_at: { type: Date, default: Date.now }
      });
    

module.exports = mongo.model('notification', Notification);
