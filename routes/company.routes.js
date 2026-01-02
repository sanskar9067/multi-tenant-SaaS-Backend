import { Router } from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import { createCompany, getCompaniesByUserId } from "../controllers/company.controller.js";

const router = Router();

router.post("/addcompany", verifyAuthMiddleware, createCompany);
router.get("/getcompanies", verifyAuthMiddleware, getCompaniesByUserId);


export default router;