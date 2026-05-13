import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        leaveType: {
            type: String,
            enum: ["HOME_VISIT", "MEDICAL", "LOCAL_OUTING", "OTHER"],
            default: "HOME_VISIT"
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        },
        adminRemarks: {
            type: String,
            trim: true
        },
        isReturned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Validation to ensure endDate is after startDate
leaveSchema.pre("validate", function (next) {
    if (this.startDate > this.endDate) {
        this.invalidate("endDate", "End date must be after the start date");
    }
});

export const Leave = mongoose.model("Leave", leaveSchema);