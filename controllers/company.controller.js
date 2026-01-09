import Board from "../models/board.model.js";
import Company from "../models/company.model.js";
import Membership from "../models/membership.model.js";
import Task from "../models/task.model.js";

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

export const getCompaniesByUserId = async(req, res) => {
    try {
        const userId = req.user._id;
        const companies = await Membership.find({ userId }).populate("companyId");
        return res.status(200).json({ success: true, companies, message: "Companies fetched successfully" });
    } catch (error) {
        console.error("Error in getCompaniesByUserId:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch companies", error });
    }
}

export const getCompanyById = async(req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        const boards = await Board.find({ companyId: req.params.companyId }).populate("createdBy");
        const members = await Membership.find({ companyId: req.params.companyId }).populate("userId");
        const tasks = await Task.find({ boardId: { $in: boards.map(board => board._id) } }).populate("assignedTo").populate("boardId");
        const payload = { company, boards, members, tasks };
        return res.status(200).json({ success: true, payload, message: "Company fetched successfully" });
    } catch (error) {
        console.error("Error in getCompanyById:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch company", error });
    }
}