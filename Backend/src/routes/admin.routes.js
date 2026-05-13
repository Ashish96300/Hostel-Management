import { Router } from "express";

import {
    authenticateUser,
    authorizeRoles
} from "../middlewares/auth.middlewear.js";

import {
    getDashboardStats
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/stats").get(
    authenticateUser,
    authorizeRoles("ADMIN"),
    getDashboardStats
);

export default router;