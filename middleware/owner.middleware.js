import Membership from "../models/membership.model.js";

const verifyOwnerMiddleware = async (req, res, next) => {
    try {
        const companyId = req.params.companyId;
        const userId = req.user._id;

        const membership = await Membership.findOne({ userId, companyId });
        if (!membership || membership.role !== "owner") {
            return res.status(403).json({ success: false, message: "Access denied. Owner role required." });
        }
        next();
    } catch (error) {
        console.error("Error in verifyOwnerMiddleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }       
}

export default verifyOwnerMiddleware;