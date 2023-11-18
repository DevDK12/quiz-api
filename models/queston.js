const mongoose = require('mongoose');

// Define Question Schema
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    marks: {
        type: Number,
        required: true,
    },
});


// Create Question model
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;