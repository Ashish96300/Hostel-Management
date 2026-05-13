import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true
        },
        type: {
            type: String,
            enum: ["SINGLE", "DOUBLE", "TRIPLE", "SUITE"],
            default: "DOUBLE"
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        occupancy: {
            type: Number,
            default: 0,
            // Logic: occupancy should never exceed capacity
            validate: {
                validator: function(value) {
                    return value <= this.capacity;
                },
                message: "Occupancy cannot exceed room capacity"
            }
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
            default: "AVAILABLE"
        },
        amenities: [
            {
                type: String, // e.g., ["AC", "Attached Washroom", "Balcony"]
                trim: true
            }
        ],
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

// Pre-save hook to automatically update status based on occupancy
roomSchema.pre("save", function (next) {
    if (this.occupancy >= this.capacity) {
        this.status = "FULL";
    } else if (this.status !== "MAINTENANCE") {
        this.status = "AVAILABLE";
    }
});

export const Room = mongoose.model("Room", roomSchema);