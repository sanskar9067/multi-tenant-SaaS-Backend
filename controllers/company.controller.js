import Company from "../models/company.model.js";
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