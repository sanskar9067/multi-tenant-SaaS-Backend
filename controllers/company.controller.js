import Company from "../models/company.model.js";
import Invite from "../models/invites.model.js";
import Membership from "../models/membership.model.js";

export const createCompany = async(req, res) => {
    try {
        const {companyName} = req.body;
        const company = await new Company({ name: companyName }).save();
        const companyId = company._id;

        const membership = new Membership({
            userId: req.user._id,
            companyId,
            role: "owner"
        });
        await membership.save();
        return res.status(201).json({ success: true, company , message: "Company created successfully"});
    } catch (error) {
        console.error("Error in createCompany:", error);
        return res.status(500).json({ success: false, message: "Failed to create company", error });
    }
}

export const inviteMember = async(req, res) => {
    try {
        const { userId, role } = req.body;
        const companyId = req.params.companyId;
        const invitedBy = req.user._id;

        const invite = new Invite({
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