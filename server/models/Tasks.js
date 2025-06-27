import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: "project",
        required: true
    }, 
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Review", "Done"],
        default: "To Do"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    assignees: [{ type: Types.ObjectId, ref: "user" }],
    watchers : [{ type: Types.ObjectId, ref: "user" }],
    dueDate: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    estimatedHours: {
        type: Number,
        min: 0,
        default: 0
    },

    actualHours: {
        type: Number,
        min: 0,
        default: 0
    },

    tags:[String],

    subtasks: [{
        title:{ type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    }],

    comments: [{
        type: Types.ObjectId,
        ref: "comment"
    }],

    attachments: [{
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number },
        uploadedBy: { type: Types.ObjectId, ref: "user" },
        uploadedAt: { type: Date, default: Date.now }
    }], 

    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },

    isArchived: {
        type: Boolean,
        default: false
    },
    
}, {timestamps: true});

const TaskModel = model("task", taskSchema);

export default TaskModel;

