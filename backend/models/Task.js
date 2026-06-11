const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "todo",
            "in_progress",
            "completed"
        ],
        default: "todo"
    },

    priority: {
        type: String,
        enum: [
            "low",
            "medium",
            "high"
        ],
        default: "medium"
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    deadline: {
        type: Date
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Task",
    TaskSchema
);