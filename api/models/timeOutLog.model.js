import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    attendanceId: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
    },
    BiometricMethod: {
        type: String,
        required: true,
    },
    TimeOut: {
        type: Date, // Đây là kiểu dữ liệu thời gian (Date) cho thời gian ra
        required: true, // Có thể cần điều này tùy thuộc vào yêu cầu
    },
    status: { //Status ghi lai trang thai nhan vien cham cong nhu dung gio, muon, som, vang mat, v.v.
        type: String,
        required: true
    }
}, { timestamps: true });

const TimeOutLog = mongoose.model('TimeOutLog', userSchema)

export default TimeOutLog;