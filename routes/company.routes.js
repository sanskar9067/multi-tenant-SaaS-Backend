import { Router } from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import { createCompany, getCompaniesByUserId, getCompanyById } from "../controllers/company.controller.js";

const router = Router();

router.post("/addcompany", verifyAuthMiddleware, createCompany);
router.get("/getcompanies", verifyAuthMiddleware, getCompaniesByUserId);
router.get("/getcompany/:companyId", verifyAuthMiddleware, getCompanyById);


export default router;