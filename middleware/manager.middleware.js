import Membership from "../models/membership.model.js";

const verifyManagerMiddleware = async(req, res, next) => {
    try {
        const companyId = req.body.companyId;
        const userId = req.user._id;

        const membership = await Membership.findOne({ userId, companyId });
        if (!membership || membership.role !== "manager") {
            return res.status(403).json({ success: false, message: "Access denied. Manager role required." });
        }
        next();
    } catch (error) {
        console.error("Error in managerMiddleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export default verifyManagerMiddleware;