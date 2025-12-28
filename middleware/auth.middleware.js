import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized access. User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await User.findById(decoded.userId);
                if (user.refreshToken !== refreshToken) {
                    return res.status(401).json({ success: false, message: "Unauthorized access. Invalid refresh token." });
                }
                const newTokens = {
                    accessToken: jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }),
                    refreshToken: jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
                };
                user.refreshToken = newTokens.refreshToken;
                await user.save();
                res.cookie("accessToken", newTokens.accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
                res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });
                req.user = user;
                next();
            } catch (err) {
                return res.status(401).json({ success: false, message: "Unauthorized access. Invalid refresh token." });
            }
        } 
        return res.status(401).json({ success: false, message: "Unauthorized access. Invalid token." });
    }
};

export default verifyAuthMiddleware;