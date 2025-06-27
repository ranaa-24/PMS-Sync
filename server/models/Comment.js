import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    text: { type: String, required: true, trim: true },
    task: {
        type: Types.ObjectId,
        ref: "task",
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    mentions: [{
        user: {
            type: Types.ObjectId,
            ref: "user"
        },
        offset: {
            type: Number, // mentions order
        },
        length: {
            type: Number, // number of mentions
        }
    }],
    reactions: [{
        user: {             // like who reacted 
            type: Types.ObjectId,
            ref: "user"
        },
        emoji: {
            type: String, // lalala "❤️"
            required: true
        }
    }],
    attachments: [{
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number },
        uploadedBy: { type: Types.ObjectId, ref: "user" },
        uploadedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const CommentModel = model("comment", commentSchema);

export default  CommentModel;

