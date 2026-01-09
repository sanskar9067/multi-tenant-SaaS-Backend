import {Router} from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import verifyManagerMiddleware from "../middleware/manager.middleware.js";
import { createTask, getTasksByUser, getTasksByBoardId, updateTaskStatus, deleteTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/add-task/:boardId", verifyAuthMiddleware, createTask);
router.get("/get-tasks", verifyAuthMiddleware, getTasksByUser);
router.get("/get-tasks/:boardId", verifyAuthMiddleware, getTasksByBoardId);
router.put("/update-task-status/:taskId", verifyAuthMiddleware, updateTaskStatus);
router.delete("/delete-task/:taskId", verifyAuthMiddleware, deleteTask);

export default router;