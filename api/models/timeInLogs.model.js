import mongoose from 'mongoose';
import moment from 'moment-timezone';

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
    TimeIn: {
        type: Date,
        required: true,
        // Sử dụng hàm set để chuyển đổi thời gian sang múi giờ mong muốn trước khi lưu vào cơ sở dữ liệu
        set: function (timeIn) {
            // Chuyển đổi thời gian sang múi giờ +7 (Asia/Ho_Chi_Minh)
            return moment(timeIn).tz('Asia/Ho_Chi_Minh').toDate();
        },
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const TimeInLog = mongoose.model('TimeInLog', userSchema);

export default TimeInLog;
