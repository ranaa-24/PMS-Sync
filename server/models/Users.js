import mongoose, {Schema}from "mongoose";

const userSchama = new Schema({
    name: {
        type: String, required: true, trim: true
    }, 

    email: {
        type: String,
        unique: true, 
        trim: true, 
        required: true, 
        tolowercase: true,
    }, 

    password: {
        type: String, 
        rrequired: true, 
        trim: true, 
        select: false,      // Do not include the password field in query results by default.
    },

    profilePic: {
        type: String, trim: true
    }, 

    emailVarified: {
        type: Boolean, default: false
    }, 

    lastLogin: {
        type: Date
    },

    is2FAEnabled: {
        type: Boolean, default: false
    },

    _2FAOtp: {
        type: String, trim: true, select: false
    },

    _2FAOtpExpires: {
        type: Date, select: false
    },

},  { timestamps: true});  // This will add "createdAt" and "updatedAt" fields automatically


const User = mongoose.model("user", userSchama);

export default User;