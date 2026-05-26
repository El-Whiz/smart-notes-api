const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    content: {
        type: String,
        required: true,
        minlength: 20
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mode: {
        type: [String],
        default: []
    },
    inputType: {
        type: String,
        default: "General"
    },
    sourceRef: {
        type: Boolean,
        default: true
    },
    transcript: {
        type: String,
        default: ''
    },
    wordCount: {
        type: Number,
        default: 0
    },
    // images: [
    //     {
    //         type: String,
    //     }
    // ]

}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;