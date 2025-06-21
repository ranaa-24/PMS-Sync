import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];       // Bearer ***
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.user = user;
            next();
            
        } catch (error) {
            console.log("Error in authMiddlware", error);
            return res.status(401).json({ message: "Token Expired, Please re-login.." });
        }

    } catch (error) {
        console.log("Error in authMiddleware : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}