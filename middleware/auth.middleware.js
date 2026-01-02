import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized access. User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized access. Invalid token." });
    }
};

export default verifyAuthMiddleware;