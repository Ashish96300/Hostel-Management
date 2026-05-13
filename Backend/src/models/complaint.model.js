import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        category: {
            type: String,
            enum: ["ELECTRICITY", "PLUMBING", "CLEANING", "FOOD", "INTERNET", "OTHER"],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
            default: "PENDING"
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM"
        },
        commentByAdmin: {
            type: String, // Feedback or reason for rejection/resolution
            trim: true,
            default: ""
        },
        resolvedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Middleware to automatically set resolvedAt when status changes to RESOLVED
complaintSchema.pre("save", async function () {
    if (this.isModified("status") && this.status === "RESOLVED") {
        this.resolvedAt = Date.now();
    }
});

export const Complaint = mongoose.model("Complaint", complaintSchema);