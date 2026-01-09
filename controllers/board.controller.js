import Board from "../models/board.model.js";
import Invite from "../models/invites.model.js";
import Membership from "../models/membership.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const createBoard = async (req, res) => {
    try {
        const { name , companyId} = req.body;
        const createdBy = req.user._id;

        const board = await Board.create({ name, companyId, createdBy });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const inviteMember = async(req, res) => {
    try {
        const { email, userId, role, companyId } = req.body;
        const boardId = req.params.boardId;
        const invitedBy = req.user._id;

        let invitedToUserId = userId;

        // If email is provided instead of userId, look up the user
        if (email && !userId) {
            const user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "User with this email address not found. Please ensure the user has an account." 
                });
            }
            invitedToUserId = user._id;
        }

        if (!invitedToUserId) {
            return res.status(400).json({ 
                success: false, 
                message: "Either email or userId must be provided" 
            });
        }

        const invite = new Invite({
            boardId,
            companyId,
            invitedTo: invitedToUserId,
            invitedBy,
            role: role || 'member',
        });
        await invite.save();
        return res.status(200).json({ success: true, message: "Member invited successfully" });
    } catch (error) {
        console.error("Error in inviteMember:", error);
        return res.status(500).json({ success: false, message: "Failed to invite member", error: error.message });
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

export const getBoardByUser = async(req, res) => {
    try {
        const userId = req.user._id
        const response = await Membership.find({userId: userId}).populate('userId').populate('boardId');
        if(response){
            return res.status(200).json({
                success: true,
                message: "Boards fetched successfully",
                data: response
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getBoardById = async(req, res) => {
    try {
        const boardId = req.params.boardId;
        const board = await Board.findById(boardId).populate('createdBy').populate('companyId');
        const tasks = await Task.find({boardId: boardId}).populate('assignedTo');
        const members = await Membership.find({boardId: boardId}).populate('userId');
        return res.status(200).json({ success: true, message: "Board fetched successfully", 
            boardData: board,
            tasks: tasks,
            members: members
          });
    } catch (error) {
        console.error("Error in getBoardById:", error);
        return res.status(500).json({ success: false, message: "Failed to get board", error });
    }
}

export const getMembersByBoardId = async(req, res) => {
    try {
        const boardId = req.params.boardId;
        const members = await Membership.find({ boardId: boardId });
        return res.status(200).json({ success: true, message: "Members fetched successfully", data: members });
    } catch (error) {
        console.error("Error in getMembersByBoardId:", error);
        return res.status(500).json({ success: false, message: "Failed to get members", error });
    }
}
