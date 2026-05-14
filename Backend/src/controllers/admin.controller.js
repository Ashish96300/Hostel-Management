import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { User } from "../models/user.model.js";
import { Room } from "../models/room.model.js";
import { Complaint } from "../models/complaint.model.js";
import { Leave } from "../models/leave.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {

    const totalStudents = await User.countDocuments({
        role: "STUDENT"
    });

    const totalRooms = await Room.countDocuments();

    const occupiedRooms = await Room.countDocuments({
        status: "FULL"
    });

    const pendingComplaints = await Complaint.countDocuments({
        status: "PENDING"
    });

    const leaveRequests = await Leave.countDocuments({
        status: "PENDING"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalStudents,
                totalRooms,
                occupiedRooms,
                pendingComplaints,
                leaveRequests
            },
            "Dashboard stats fetched successfully"
        )
    );
});

export {
    getDashboardStats
};