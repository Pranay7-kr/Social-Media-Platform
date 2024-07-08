// import { MongoOIDCError } from "mongodb";
import mongoose from "mongoose";

export const tokenBlackListSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})