import { Router } from "express";
import { loginUser, signUpUser, test, verifyOTPAndSave } from "../controllers/auth.controller.js";
import verifyAuthMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signUpUser);
router.post("/verify-otp", verifyOTPAndSave);
router.post("/login", loginUser);
router.get("/test", verifyAuthMiddleware, test);

export default router;