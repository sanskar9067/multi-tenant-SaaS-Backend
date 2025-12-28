import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    role: {
        type: String,
        enum: ["owner", "manager", "member"],
        default: "member",
    }
}, { timestamps: true });

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;