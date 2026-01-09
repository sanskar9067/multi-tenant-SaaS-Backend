import Task from "../models/task.model.js";
import Membership from "../models/membership.model.js";

export const createTask = async (req, res) => {
    try {
        const {title, description, assignedTo, priority} = req.body;
        const isMember = await Membership.findOne({
            boardId: req.params.boardId,
            userId: assignedTo
        });
        if(!isMember) {
            return res.status(400).json({ success: false, message: "User is not a member of the board" });
        }
        if(!title || !assignedTo || !description) {
            return res.status(400).json({ success: false, message: "Title, description and User are required" });
        }
        const newTask = new Task({
            title,
            description,
            boardId: req.params.boardId,
            assignedTo,
            priority,
        });
        await newTask.save();
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getTasksByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ assignedTo: userId });
        if(tasks){
            return res.status(200).json({ success: true, data: tasks });
        } else {
            return res.status(400).json({ success: false, message: "No tasks found" });
        }
    } catch (error) {
        console.error("Error getting tasks:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export const getTasksByBoardId = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const tasks = await Task.find({ boardId: boardId });
        return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error getting tasks:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const validStatuses = ["To Do", "In Progress", "Done"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        return res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};