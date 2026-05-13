import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser ,getCurrentUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewear.js";
import { authenticateUser } from "../middlewares/auth.middlewear.js";

const router = Router();

// --- PUBLIC ROUTES ---

// .single("avatar") matches the field name your frontend will send
router.route("/register").post(
    upload.single("avatar"), 
    registerUser
);

router.route("/login").post(loginUser);

// --- SECURED ROUTES ---

// Logout requires the user to be logged in first
router.route("/logout").post(
    authenticateUser, 
    logoutUser
);

router.route("/current-user").get(authenticateUser, getCurrentUser);

export default router;