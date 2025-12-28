import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    name: {
        type: String,
        required: true,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do"
    }
}, { timestamps: true });

const Column = mongoose.model("Column", columnSchema);

export default Column;