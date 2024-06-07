import mongoose, { Schema } from "mongoose";

// Định nghĩa mô hình Biometric
const BiometricSchema = new mongoose.Schema({
    method: { type: String, required: true },
    data: { type: String, required: true },
});

// Định nghĩa mô hình Users
const userSchema = new mongoose.Schema({
    userID: { type: Number, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String },
    department: { type: String },
    address: { type: String },
    avatar: {
        type: String,
        default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "employee"], // Chỉ cho phép giá trị là "admin" hoặc "employee"
        default: "employee", // Giá trị mặc định là "employee"
    },
    biometrics: [BiometricSchema],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
