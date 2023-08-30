const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    taskListId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskList'
    },
    isFavorite: { type: Boolean, default: false },
    // Other task-related fields...
});

module.exports = mongoose.model('Task', taskSchema);
