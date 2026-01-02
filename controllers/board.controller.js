import Board from "../models/board.model.js";
import Invite from "../models/invites.model.js";
import Membership from "../models/membership.model.js";

export const createBoard = async (req, res) => {
    try {
        const { name } = req.body;
        const companyId = req.params.companyId;
        const createdBy = req.user._id;

        const board = await Board.create({ name, companyId, createdBy });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const inviteMember = async(req, res) => {
    try {
        const { userId, role, companyId } = req.body;
        const boardId = req.params.boardId;
        const invitedBy = req.user._id;

        const invite = new Invite({
            boardId,
            companyId,
            invitedTo: userId,
            invitedBy,
            role,
        });
        await invite.save();
        return res.status(200).json({ success: true, message: "Member invited successfully" });
    } catch (error) {
        console.error("Error in inviteMember:", error);
        return res.status(500).json({ success: false, message: "Failed to invite member", error });
    }
}

export const respondToInvite = async(req, res) => {
    try {
        const { inviteId, response } = req.body; // response can be 'accepted' or 'declined'
        const invite = await Invite.findById(inviteId);
        if (!invite) {
            return res.status(404).json({ success: false, message: "Invite not found" });
        }

        if (invite.invitedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to respond to this invite" });
        }

        invite.status = response;
        await invite.save();

        if (response === "accepted") {
            const membership = new Membership({
                userId: req.user._id,
                companyId: invite.companyId,
                boardId: invite.boardId,
                role: invite.role,
            });
            await membership.save();
        }

        return res.status(200).json({ success: true, message: `Invite ${response} successfully` });
    } catch (error) {
        console.error("Error in respondToInvite:", error);
        return res.status(500).json({ success: false, message: "Failed to respond to invite", error });
    }
}
