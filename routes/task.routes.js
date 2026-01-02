import {Router} from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import verifyManagerMiddleware from "../middleware/manager.middleware.js";
import { createTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/add-task/:companyId/:boardId", verifyAuthMiddleware, verifyManagerMiddleware, createTask);

export default router;