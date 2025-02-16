const mongo = require('mongoose');
const Schema = mongo.Schema;

const OAuth = new Schema(
    {
        id: {
            type: mongoose.Schema.Types.UUID,
            default: () => new mongoose.Types.UUID(),
            unique: true,
            required: true,
          },
          user_id: {
            type: mongoose.Schema.Types.UUID,
            required: true,
          },
          provider: {
            type: String,
            required: true,
            enum: ["Google", "GitHub"], // Tu peux ajouter d'autres providers ici
          },
          provider_id: {
            type: String,
            required: true,
          },
          created_at: {
            type: Date,
            default: Date.now,
          },  
    }



);
module.exports = mongo.model('oAuth', OAuth);
