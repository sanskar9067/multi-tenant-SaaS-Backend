import { Router } from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import { createCompany } from "../controllers/company.controller.js";

const router = Router();

router.post("/addcompany", verifyAuthMiddleware, createCompany);

export default router;