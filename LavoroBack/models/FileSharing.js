// const mongo = require('mongoose');
// const Schema = mongo.Schema;

// const FileSharing = new Schema(
//     {
//         owner_id: { type: mongoose.Schema.Types.UUID, required: true },
//         file_name: { type: String, required: true },
//         file_url: { type: String, required: true }, // Stocke l'URL du fichier
//         shared_with: [{ type: mongoose.Schema.Types.UUID }], // Liste des utilisateurs avec qui le fichier est partagé
//         uploaded_at: { type: Date, default: Date.now },
//         file_size : { type: Number, required: false },
//         file_extension : { type: String, required: false },
//     }
// )
// module.exports = mongo.model('fileSharing', FileSharing);



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSharing = new Schema(
    {
        owner_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
        file_name: { type: String, required: true },
        file_url: { type: String, required: true },
        shared_with: [{ 
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            permission: { type: String, enum: ['view', 'edit'], default: 'view' }
        }],
        uploaded_at: { type: Date, default: Date.now },
        file_size: { type: Number, required: true },
        file_extension: { type: String, required: true },
        file_type: { 
            type: String, 
            required: true,
            enum: ['image', 'video', 'audio', 'document', 'archive', 'other'] 
        },
        is_public: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('FileSharing', FileSharing);