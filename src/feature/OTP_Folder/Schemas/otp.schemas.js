import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"]
    },

    otp: {
        type: String,
        required: [true, "OTP is required"]
    },
    expiresAt: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean
    }
});

export default otpSchema;