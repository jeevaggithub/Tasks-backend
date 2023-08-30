const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Reference to the Task schema
    },
    title: String,
    description: String,
    dueDate: Date,
    isFavorite: Boolean,
});

module.exports = mongoose.model('UserTask', userTaskSchema);
