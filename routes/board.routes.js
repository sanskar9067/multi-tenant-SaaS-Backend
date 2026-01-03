import {Router} from 'express';
import { createBoard, getBoardByUser, inviteMember, respondToInvite, getBoardById } from '../controllers/board.controller.js';
import verifyOwnerMiddleware from '../middleware/owner.middleware.js';
import verifyAuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post("/create-board", verifyAuthMiddleware, verifyOwnerMiddleware, createBoard);
router.post("/invite/:boardId", verifyAuthMiddleware, verifyOwnerMiddleware, inviteMember);
router.post("/respond-invite", verifyAuthMiddleware, respondToInvite);
router.get("/get-boards", verifyAuthMiddleware, getBoardByUser);
router.get("/get-board/:boardId", verifyAuthMiddleware, getBoardById);

export default router;