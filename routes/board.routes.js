import {Router} from 'express';
import { createBoard, inviteMember, respondToInvite } from '../controllers/board.controller.js';
import verifyOwnerMiddleware from '../middleware/owner.middleware.js';
import verifyAuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post("/create-board/:companyId", verifyAuthMiddleware, verifyOwnerMiddleware, createBoard);
router.post("/invite/:boardId", verifyAuthMiddleware, verifyOwnerMiddleware, inviteMember);
router.post("/respond-invite", verifyAuthMiddleware, respondToInvite);

export default router;