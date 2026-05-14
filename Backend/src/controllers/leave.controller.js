import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Leave } from "../models/leave.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

// --- STUDENT ACTIONS ---

// 1. Apply for Leave
const applyForLeave = asyncHandler(async (req, res) => {
    const { reason, startDate, endDate, leaveType } = req.body;

    // Validation
    if (!reason || !startDate || !endDate) {
        throw new ApiError(400, "Reason, start date, and end date are required");
    }

    // Logic: Ensure start date is not in the past
    if (new Date(startDate) < new Date().setHours(0,0,0,0)) {
        throw new ApiError(400, "Start date cannot be in the past");
    }

    // Logic: Ensure end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
        throw new ApiError(400, "End date must be after the start date");
    }

    const leaveRequest = await Leave.create({
        student: req.user._id,
        reason,
        startDate,
        endDate,
        leaveType: leaveType || "HOME_VISIT"
    });

    return res.status(201).json(
        new ApiResponse(201, leaveRequest, "Leave request submitted successfully")
    );
});

// 2. View My Leave History (Student)
const getMyLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, leaves, "Leave history fetched successfully")
    );
});

// --- ADMIN ACTIONS ---

// 3. View All Leave Requests (Admin Dashboard)
const getAllLeaveRequests = asyncHandler(async (req, res) => {
    const { status } = req.query;

    let filter = {};
    if (status) filter.status = status.toUpperCase();

    const leaves = await Leave.find(filter)
        .populate("student", "fullName email room branch enrollmentNumber")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, leaves, "All leave requests fetched successfully")
    );
});

// 4. Approve or Reject Leave Request
const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { leaveId } = req.params;
    const { status, adminRemarks } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status.toUpperCase())) {
        throw new ApiError(400, "Invalid status. Use APPROVED or REJECTED");
    }

    const leave = await Leave.findByIdAndUpdate(
        leaveId,
        { 
            $set: { 
                status: status.toUpperCase(),
                adminRemarks: adminRemarks || "" 
            } 
        },
        { new: true }
    );

    if (!leave) {
        throw new ApiError(404, "Leave request not found");
    }

    return res.status(200).json(
        new ApiResponse(200, leave, `Leave request ${status.toLowerCase()} successfully`)
    );
});

export {
    applyForLeave,
    getMyLeaves,
    getAllLeaveRequests,
    updateLeaveStatus
};