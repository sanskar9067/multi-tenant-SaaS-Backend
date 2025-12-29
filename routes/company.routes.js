import { Router } from "express";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";
import { createCompany, inviteMember, respondToInvite } from "../controllers/company.controller.js";
import verifyOwnerMiddleware from "../middleware/owner.middleware.js";

const router = Router();

router.post("/addcompany", verifyAuthMiddleware, createCompany);
router.post("/invite/:companyId", verifyAuthMiddleware, verifyOwnerMiddleware, inviteMember);
router.post("/respond-invite", verifyAuthMiddleware, respondToInvite);

export default router;