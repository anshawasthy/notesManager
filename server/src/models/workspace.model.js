const mongoose = require('mongoose');
const crypto = require("crypto");

const notesSchema = new mongoose.Schema({
    title: String,
    content: String,
    updateTime: Date,
    tags : [String],
    category: String
});

const workspaceSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: String,
    isPublic: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: String,
        unique: true,
        default: () => crypto.randomUUID()
    },
    notes: [
        {
            title: String,
            content: String,
            tags: [String],
            category: String,
            updateTime: {
                type: Date,
                default: Date.now
            }
        }
    ]
});




const workspaceModel = mongoose.model('Workspace', workspaceSchema);

module.exports = workspaceModel;