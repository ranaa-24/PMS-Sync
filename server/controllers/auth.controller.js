import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Varification from "../models/Varification.js";
import sendMail from "../utils/send-mail.js";
import { aj } from "../utils/arcjet.configures.js";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // arcjet protects app from fake temp mails
        const decision = await aj.protect(req, { email });
        console.log("Arcjet Denied : ", decision.isDenied());

        if (decision.isDenied()) {
            console.log("email denied")
            res.writeHead(403, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Disposable email addresses are not allowed." }));
        }
        ///--------------------

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email address already registered" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });


        const jwtToken = jwt.sign(
            {
                userId: newUser._id,
                purpose: "email_varification"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // we are storing this token so that we can revoke it if needed, like log out
        await Varification.create({
            userId: newUser._id,
            token: jwtToken,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 h from now, 1 * 60 * 60 * 1000 = 1 hour in mili
        });


        // Email varification 
        // when user clicks on the link will redirect to register page and i will cut the token from the url and send it to the backend to verify the user
        const varificationLink = `${process.env.FRONTEND_URL}/verify-mail?token=${jwtToken}`;
        const emailContent = `
            <div style="background-color: #ffffff; color: #000000; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #000000; border-radius: 5px;">
            <h1 style="text-align: center;">Welcome to Sync, ${name}!</h1>
            <p style="font-size: 16px; text-align: center">Thank you for registering. Please verify your email address by clicking the link below:</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="${varificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </div>
            </div>
        `;
        const emailSubject = "Email Verification";

        const isEmailSent = await sendMail(email, emailSubject, emailContent);

        if (!isEmailSent) {
            return res.status(500).json({
                message: "Failed to send verification email. Please try again later."
            });
        }

        return res.status(201).json({
            message: "Please check your Inbox or Spam folder.",
        });

    } catch (err) {
        console.log("Error in registerUser:", err.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(400).json({ message: "Invalid email or password" });

        // email verification check
        if (!user.emailVarified) {
            const existingVerificationRecord = await Varification.findOne({ userId: user._id });
            // if their token still valid..
            if (existingVerificationRecord && existingVerificationRecord.expiresAt > new Date()) {
                return res.status(400).json({ message: "Email not verified, Please check your email." })
            }

            // o/w create a new token entry, and delete prev one, 
            await Varification.findByIdAndDelete({ _id: existingVerificationRecord._id });

            const newToken = jwt.sign(
                {
                    userId: user._id,
                    purpose: "email_varification"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            await Varification.create({
                userId: user._id,
                token: newToken,
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1h from now
            });

            const varificationLink = `${process.env.FRONTEND_URL}/verify-mail?token=${newToken}`;
            const emailContent = `
            <div style="background-color: #ffffff; color: #000000; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #000000; border-radius: 5px;">
            <h1 style="text-align: center;">Welcome to Sync, ${name}!</h1>
            <p style="font-size: 16px; text-align: center">Thank you for registering. Please verify your email address by clicking the link below:</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="${varificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </div>
            </div>
        `;
            const emailSubject = "Email Verification";

            const isEmailSent = await sendMail(email, emailSubject, emailContent);

            if (!isEmailSent) {
                return res.status(500).json({
                    message: "Failed to send verification email. Please try again later."
                });
            }

            return res.status(201).json({
                message: "Please check your Inbox or Spam folder, to verify its you.",
            });


        }

        // all checks done.. now grant access using token of login purpose
        const token = jwt.sign({userId : user._id, purpose : "login"}, process.env.JWT_SECRET, {expiresIn : "7d"});
        
        user.lastLogin = new Date();
        await user.save();

        // berfore sending ther user lemme delete the password feild, [mongoose returns mongoose.Documment, with its own set of methods]
        const userInfo = user.toObject();
        delete userInfo.password;

        return res.status(200).json({
            message : "Login Successful", 
            token, 
            user : userInfo,       // all user infos 
        });

    } catch (err) {
        console.log("Error in loginUser:", err.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const verifyMail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        let playLoad;

        try {
            playLoad = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }


        if (!playLoad || playLoad.purpose !== "email_varification") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // we hv stored the userId and token in the varification collection. before sending sendinf thoken thru email
        const varification = await Varification.findOne({
            userId: playLoad.userId,
            token: token
        });

        if (!varification) {
            return res.status(404).json({ message: "Unauthorized" });
        }

        // good old days, ahh checks
        if (varification.expiresAt < new Date()) {      // Date.now() gives current time in milliseconds, new Date() gives current time in a standered format
            return res.status(400).json({ message: "Token has expired" });
        }

        const user = await User.findById(varification.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.emailVarified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        user.emailVarified = true;
        await user.save(); // Save the updated user document

        // .deleteOne we wont get the deleted doc, but using .findOneAndDelete or .findByIdAndDelete we can get the deleted doc
        // .find* thaklei document return hobe
        await Varification.deleteOne({ userId: varification.userId, token: token });

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (err) {
        console.log("Error in verifyMail:", err.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}