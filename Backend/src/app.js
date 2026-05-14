
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middlewear.js";

const app = express();


app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            process.env.CORS_ORIGIN,
            "http://localhost:5173",
            "http://localhost:3000",
        ];
        
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
console.log("backend cors ",process.env.CORS_ORIGIN)

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import roomRouter from './routes/room.routes.js';
import leaveRouter from './routes/leave.routes.js';
import complaintRouter from './routes/complaint.routes.js';
import adminRouter from "./routes/admin.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/leave", leaveRouter);
app.use("/api/v1/complaint", complaintRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorMiddleware);

export { app };