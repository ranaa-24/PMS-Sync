import { Schema, model, Types } from "mongoose"

const varificationSchema = new Schema({
    userId: {
        type: Types.ObjectId, 
        ref: "User",            // a foreign key reference to User model, will use .populate()
        required: true
    }, 
    token: {
        type: String, 
        required: true
    },
    expiresAt: {
        type: Date, 
        required: true
    }

}, {timestamps: true});


const Varification = model("Varification", varificationSchema);

export default Varification;
