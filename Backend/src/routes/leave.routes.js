import { Router } from "express";
import { 
    getAllLeaveRequests, 
    applyForLeave, 
    getMyLeaves, 
    updateLeaveStatus 
} from "../controllers/leave.controller.js"; // Added .js extension
import { authenticateUser, authorizeRoles } from "../middlewares/auth.middlewear.js";

const router = Router();

// --- Students ---
router.route("/apply").post(
    authenticateUser, 
    authorizeRoles("STUDENT"), 
    applyForLeave
);

router.route("/my-leaves").get(
    authenticateUser, 
    authorizeRoles("STUDENT"), // Added this for consistency and security
    getMyLeaves
);

// --- Admins ---
router.route("/admin/all-leaves").get(
    authenticateUser, 
    authorizeRoles("ADMIN"), 
    getAllLeaveRequests
);

router.route("/admin/status/:leaveId").patch(
    authenticateUser, 
    authorizeRoles("ADMIN"), 
    updateLeaveStatus
);

export default router;