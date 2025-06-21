import { Schema, model, Types } from 'mongoose'


const WorkspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true
    },

    color: {
        type: String,
        required: true,
        default: "#4A90E2"
    },

    owner: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },

    // members are array of objects.. the object contains user, role
    members: [{
        user: {
            type: Types.ObjectId,
            ref: 'user'
        },
        role: { type: String, enum: ['admin', 'owner', 'member', 'viewer'], default: "member" },
        joinedAt: {type: Date, default: Date.now}, 
    }], 
    
    projects: [{type: Types.ObjectId, ref: "projects"}],    /// array of project reference, not array of obbjects,, like subject: [string] - arr of strings

}, {timestamps: true});


const WorkspaceModel = model("workspace", WorkspaceSchema);

export default WorkspaceModel;