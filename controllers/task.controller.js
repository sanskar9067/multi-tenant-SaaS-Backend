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
            priority
        });
        await newTask.save();
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};