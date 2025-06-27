import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    }, 

    description: {
        type: String,
        trim: true
    },

    workspace:{
        type: Types.ObjectId,
        ref: "workspace",
        required: true
    }, 

    status: {
        type: String,
        enum: ["Planning", "In Progress", "Completed", "On Hold", "Cancelled"],
        default: "Planning"
    }, 

    startDate: {
        type: Date,
    },

    dueDate: {
        type: Date,
    },

    progress:{
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0
    }, 

    tasks: [{
        type: Types.ObjectId,
        ref: "task"
    }],

    members: [{
        user: {
            type: Types.ObjectId,
            ref: "user",
            required: true
        },
        role: {
            type: String,
            enum: ["manager", "contributor", "viewer"],
            default: "contributor"
        },
    }],

    tags: [String],

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

const ProjectModel = mongoose.model("project", ProjectSchema);

export default ProjectModel;

