import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do"
    },
    priority: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Low"
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;