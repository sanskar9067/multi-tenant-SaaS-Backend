import {Router} from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import verifyManagerMiddleware from "../middleware/manager.middleware.js";
import { createTask, getTasksByUser, getTasksByBoardId } from "../controllers/task.controller.js";

const router = Router();

router.post("/add-task/:companyId/:boardId", verifyAuthMiddleware, verifyManagerMiddleware, createTask);
router.get("/get-tasks", verifyAuthMiddleware, getTasksByUser);
router.get("/get-tasks/:boardId", verifyAuthMiddleware, getTasksByBoardId);

export default router;