import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    }
}, { timestamps: true });

const BoardMember = mongoose.model("BoardMember", boardMemberSchema);