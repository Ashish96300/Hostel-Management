import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Complaint } from "../models/complaint.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const submitComplaint = async (req, res, next) => {
    try {
        const { category, title, description } = req.body;
        
        if (!category || !title || !description) {
             return res.status(400).json({ message: "Fields missing" });
        }

        const complaint = await Complaint.create({
            student: req.user._id,
            category: category.toUpperCase(),
            title,
            description
        });

        return res.status(201).json({ data: complaint, message: "Success" });
    } catch (error) {
        next(error); 
    }
};


const updateComplaintStatus = asyncHandler(async (req, res, next) => { 
    const { complaintId } = req.params;
    const { status, commentByAdmin } = req.body;

    if (!["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].includes(status.toUpperCase())) {
        return next(new ApiError(400, "Invalid status update"));
    }

    const complaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { 
            $set: { 
                status: status.toUpperCase(),
                commentByAdmin: commentByAdmin || "" 
            } 
        },
        { new: true }
    );

    if (!complaint) {
        return next(new ApiError(404, "Complaint not found"));
    }

    return res.status(200).json(
        new ApiResponse(200, complaint, `Complaint marked as ${status}`)
    );
});


const getStudentComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, complaints, "Your complaints fetched successfully")
    );
});

// --- ADMIN ACTIONS ---

const getAllComplaints = asyncHandler(async (req, res) => {
    const { category, status } = req.query;

    let filter = {};
    if (category) filter.category = category.toUpperCase();
    if (status) filter.status = status.toUpperCase();

    const complaints = await Complaint.find(filter)
        .populate("student", "fullName room phoneNumber roomNumber")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, complaints, "All complaints fetched successfully")
    );
});

export {
    submitComplaint,
    getStudentComplaints,
    getAllComplaints,
    updateComplaintStatus
};