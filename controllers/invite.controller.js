import Invite from "../models/invites.model.js";
import Membership from "../models/membership.model.js";

export const getInvites = async (req, res) => {
  try {
    const userId = req.user._id;
    const invites = await Invite.find({ 
      invitedTo: userId,
      status: "pending"
    })
      .populate("boardId")
      .populate("companyId")
      .populate("invitedBy");

    return res.status(200).json({ 
      success: true, 
      data: invites,
      message: "Invites fetched successfully" 
    });
  } catch (error) {
    console.error("Error in getInvites:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch invites", 
      error 
    });
  }
};

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