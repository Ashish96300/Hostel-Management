import { Router } from "express";
import { 
    createRoom, 
    getAllRooms, 
    getRoomDetails, 
    updateRoomStatus, 
    assignStudentToRoom,
    getRoomStats 
} from "../controllers/room.controller.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.middlewear.js";

const router = Router();

// --- PUBLIC/COMMON ROUTES ---
// Everyone (Admin & Student) should be able to see room availability
router.route("/all").get(authenticateUser, getAllRooms);
router.route("/stats").get(authenticateUser, getRoomStats);
router.route("/details/:roomId").get(authenticateUser, getRoomDetails);

// --- ADMIN ONLY ROUTES ---
// These routes require ADMIN role
router.route("/create").post(
    authenticateUser, 
    authorizeRoles("ADMIN"), 
    createRoom
);

router.route("/update-status/:roomId").patch(
    authenticateUser, 
    authorizeRoles("ADMIN"), 
    updateRoomStatus
);

router.route("/assign-student").post(
    authenticateUser, 
    authorizeRoles("ADMIN"), 
    assignStudentToRoom
);

export default router;