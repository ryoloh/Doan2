import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    LogInfoId: { //Bao gồm Reason, Note, Event
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

const LogInfo = mongoose.model('LogInfo', userSchema)

export default LogInfo;