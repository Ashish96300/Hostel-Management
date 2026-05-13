import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        // --- CORE IDENTITY (Common for Admin & Student) ---
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        avatar: {
            type: String, 
            default: ""
        },
        role: {
            type: String,
            enum: ["ADMIN", "STUDENT"],
            default: "STUDENT"
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },

        // --- STUDENT SPECIFIC DATA ---
        // These will be null if the role is ADMIN
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            default: null
        },
        enrollmentNumber: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple nulls for Admin users
            trim: true
        },
        branch: {
            type: String, // e.g., "IT", "CS"
            trim: true
        },
        
        // --- AUTH TOKENS ---
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// HOOKS: Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});
// METHODS: Check password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// METHODS: Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// METHODS: Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);