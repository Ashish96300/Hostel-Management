import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const createRoom = asyncHandler(async (req, res) => {
    const { roomNumber, type, capacity, price, amenities } = req.body;
    
    if ([roomNumber, type].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Room number and type are required");
    }

    if (!capacity || !price) {
        throw new ApiError(400, "Capacity and Price are required");
    }

    const existedRoom = await Room.findOne({ roomNumber: roomNumber.toUpperCase() });
    if (existedRoom) {
        throw new ApiError(409, "Room number already exists");
    }

    const room = await Room.create({
        roomNumber: roomNumber.toUpperCase(),
        type,
        capacity,
        price,
        amenities: amenities || []
    });

    return res.status(201).json(
        new ApiResponse(201, room, "Room created successfully")
    );
});


const getAllRooms = asyncHandler(async (req, res) => {
    const { status, type } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const rooms = await Room.find(query).populate("students", "fullName email avatar");

    return res.status(200).json(
        new ApiResponse(200, rooms, "Rooms fetched successfully")
    );
});

const getRoomDetails = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate("students", "fullName email phoneNumber branch enrollmentNumber");

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    return res.status(200).json(
        new ApiResponse(200, room, "Room details fetched successfully")
    );
});

const updateRoomStatus = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { status } = req.body;

    if (!["AVAILABLE", "FULL", "MAINTENANCE"].includes(status)) {
        throw new ApiError(400, "Invalid status type");
    }

    const room = await Room.findByIdAndUpdate(
        roomId,
        { $set: { status } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, room, "Room status updated")
    );
});

const assignStudentToRoom = asyncHandler(async (req, res) => {

    const { roomId, email } = req.body;

    const room = await Room.findById(roomId);

    const user = await User.findOne({ email });

    if (!room || !user) {
        throw new ApiError(404, "Room or Student not found");
    }

    if (user.role !== "STUDENT") {
        throw new ApiError(400, "Only students can be assigned rooms");
    }

    if (user.room) {
        throw new ApiError(
            400,
            "Student already assigned to another room"
        );
    }

    if (room.occupancy >= room.capacity) {
        throw new ApiError(400, "Room is already full");
    }

    user.room = room._id;

    await user.save({ validateBeforeSave: false });

    room.students.push(user._id);

    room.occupancy += 1;

    await room.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { room, user },
            "Student assigned successfully"
        )
    );
});

const getRoomStats = asyncHandler(async (req, res) => {
    const vacantRooms = await Room.find({ status: "AVAILABLE" });
    const occupiedRooms = await Room.find({ status: "FULL" });
    const maintenanceRooms = await Room.find({ status: "MAINTENANCE" });

    return res.status(200).json(
        new ApiResponse(200, {
            vacantCount: vacantRooms.length,
            occupiedCount: occupiedRooms.length,
            maintenanceCount: maintenanceRooms.length,
            rooms: [...vacantRooms, ...occupiedRooms]
        }, "Room statistics fetched successfully")
    );
});

export { 
    createRoom, 
    getAllRooms, 
    getRoomDetails, 
    updateRoomStatus,
    assignStudentToRoom,
    getRoomStats
};