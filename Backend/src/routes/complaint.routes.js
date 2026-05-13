// Student routes
import {Router} from "express"
import {submitComplaint, getStudentComplaints, getAllComplaints, updateComplaintStatus} from "../controllers/complaint.controller.js"
import { authenticateUser, authorizeRoles } from "../middlewares/auth.middlewear.js";

const router=Router()

router.route("/submit").post(authenticateUser, authorizeRoles("STUDENT"), submitComplaint);
router.route("/my-complaints").get(authenticateUser, authorizeRoles("STUDENT"), getStudentComplaints);

// Admin routes
router.route("/admin/all").get(authenticateUser, authorizeRoles("ADMIN"), getAllComplaints);
router.route("/admin/status/:complaintId").patch(authenticateUser, authorizeRoles("ADMIN"), updateComplaintStatus);

export default router




