const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String, 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
}) 

module.exports = mongoose.model("Note", noteSchema)