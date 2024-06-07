import User from "../models/user.model.js"
import TimeInLog from "../models/timeInLogs.model.js";
import TimeOutLog from '../models/timeOutLog.model.js'
import { startOfDay, endOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import fuzzy from 'fuzzy';

export const test = (req, res) => {
    res.json({
        message: 'Api is working!',
    })
}

export const testApi = (req, res) => {
    res.json({
        message: 'Api is working!',
    })
}

export const updateUser = async (req, res, next) => {
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { userID: req.params.id }, // Tìm user bằng userID thay vì _id
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    role: req.body.role,
                    avatar: req.body.avatar,
                    phonenumber: req.body.phonenumber,
                    address: req.body.address,
                    department: req.body.department
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, req.body.userID, "User not found"));
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};



export const testdelete = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id, { new: true })
        res.clearCookie("access_token")
        res.status(200).json("User has been deleted!")
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Xóa từ bảng User
        const deleteUserResult = await User.deleteOne({ userID: id });

        // Xóa từ bảng TimeInLog
        const deleteTimeInLogResult = await TimeInLog.deleteMany({ userID: id });

        // Xóa từ bảng TimeOutLog
        const deleteTimeOutLogResult = await TimeOutLog.deleteMany({ userID: id });

        // Kiểm tra xem có bản ghi nào đã được xóa không
        if (
            deleteUserResult.deletedCount > 0 ||
            deleteTimeInLogResult.deletedCount > 0 ||
            deleteTimeOutLogResult.deletedCount > 0
        ) {
            return res.status(200).json({ success: true, message: "Đã xóa tất cả các bản ghi có trùng userID." });
        } else {
            return res.status(404).json({ success: false, message: "Không có bản ghi nào được xóa với userID đã cho." });
        }
    } catch (error) {
        console.error("Error deleting records:", error);
        return res.status(500).json({ success: false, message: "Đã có lỗi xảy ra trong quá trình xóa." });
    }
};




export const getUser = async (req, res, next) => {
    try {
        const [users, userCheckIn, userCheckOut] = await Promise.all([
            User.find(),
            TimeInLog.find(),
            TimeOutLog.find()
        ]);

        res.json({
            users,
            userCheckIn,
            userCheckOut
        });
    } catch (error) {
        next(error);
    }
};

export const amountUser = async (req, res, next) => {
    try {
        // Lấy ra ngày hiện tại
        const currentDate = new Date();

        // Đặt thời điểm bắt đầu của ngày
        const startOfDayDate = startOfDay(currentDate);

        // Đặt thời điểm cuối của ngày
        const endOfDayDate = endOfDay(currentDate);

        // Truy vấn để đếm số lượng userID không trùng nhau trong ngày trong bảng TimeInLogs
        const uniqueUserCount = await TimeInLog.countDocuments({
            createdAt: { $gte: startOfDayDate, $lt: endOfDayDate }
        });

        // Truy vấn để đếm tổng số lượng người dùng trong bảng Users
        const totalUserCount = await User.countDocuments();

        res.json({ totalUsers: totalUserCount, uniqueUsersToday: uniqueUserCount });
    } catch (error) {
        next(error);
    }
};

export const ProfileDetail = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!");
        }
        const userID = req.params.id;
        const user = await User.findOne({ userID: userID });
        const { password, ...rest } = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
};

export const AttendanceDetail = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!");
        }
        const userID = req.params.id;
        const user = await User.findOne({ userID: userID });
        const { password, ...rest } = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
};

export const saveBiometric = async (req, res, next) => {
    try {
        const { userId, method } = req.body;
        const user = await User.findOne({ userID: userId });
        const data = "Đã có dữ liệu";

        if (!user) {
            throw new Error("User not found");
        }
        const existingBiometricIndex = user.biometrics.findIndex(bio => bio.method === method);

        if (existingBiometricIndex !== -1) {
            user.biometrics[existingBiometricIndex].data = data;
        } else {
            user.biometrics.push({
                method: method,
                data: data,
            });
        }
        await user.save();

        const { password, ...rest } = user._doc;
        res.status(200).json({ rest, message: 'Biometric data saved successfully', user });
    } catch (error) {
        next(error);
    }
};

// export const deleteBiometric = async (req, res, next) => {
//     try {
//         const { userId, method } = req.body;
//         const user = await User.findOne({ userID: userId });
//         if (!user) {
//             throw new Error("User not found");
//         }
//         const biometricIndexToDelete = user.biometrics.findIndex(bio => bio.method === method);

//         ESPToDeleteBiometric(biometricIndexToDelete)

//         if (biometricIndexToDelete !== -1) {
//             user.biometrics.splice(biometricIndexToDelete, 1);
//             await user.save();
//             const { password, ...rest } = user._doc;
//             res.status(200).json({ rest, message: 'Biometric data deleted successfully', user });
//         } else {
//             res.status(404).json({ message: 'Biometric not found' });
//         }
//     } catch (error) {
//         next(error);
//     }
// };
let currentDataToDelete = null;
let isDataAvailableToDelete = false;

export const ESPToDeleteBiometric = async (req, res, next) => {
    try {
        const { userId, method } = req.body;
        const user = await User.findOne({ userID: userId });

        if (!user) {
            throw new Error("User not found");
        }

        const biometricIndexToDelete = user.biometrics.findIndex(bio => bio.method === method);

        if (biometricIndexToDelete !== -1) {
            const deletedBiometric = user.biometrics[biometricIndexToDelete];

            // Update MongoDB document to remove the biometric
            await User.updateOne(
                { userID: userId },
                { $pull: { biometrics: { method: method } } }
            );

            currentDataToDelete = { userId: userId, method: method };
            isDataAvailableToDelete = true;
            res.json({ data: currentDataToDelete, message: 'Data to delete updated successfully' });
        } else {
            res.status(404).json({ message: 'Biometric not found' });
        }
    } catch (error) {
        next(error);
    }
};



// deleteBiometric API Route for ESP32
export const deleteBiometricESP = (req, res, next) => {
    try {
        if (!isDataAvailableToDelete) {
            return res.status(404).json({ error: 'Data not available yet' });
        }

        const data = currentDataToDelete;

        // Reset data and flag after sending the response
        res.json(data);
        currentDataToDelete = null;
        isDataAvailableToDelete = false;
    } catch (error) {
        next(error);
    }
};


// Hàm tạo chuỗi ngẫu nhiên với ký tự số và độ dài 6
function generateUniqueAttendanceId() {
    let result = '';
    const characters = '0123456789';
    const length = 6;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const checkAttendance = async (req, res, next) => {
    try {
        const { method, data } = req.body;
        const user = await User.findOne({
            'biometrics.method': method,
            'userID': data,
        });
        if (!user) {
            throw new Error("User not found");
        }
        const { username, userID } = user;
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const existingTimeInLog = await TimeInLog.findOne({
            userID,
            TimeIn: { $gte: todayStart, $lt: todayEnd },
        });

        // Nếu đã có bản ghi chấm công vào làm trong ngày
        if (existingTimeInLog) {
            // Kiểm tra xem đã có bản ghi chấm công tan làm trong ngày chưa
            const existingTimeOutLog = await TimeOutLog.findOne({
                userID,
                TimeOut: { $gte: todayStart, $lt: todayEnd },
            });

            // Nếu đã có bản ghi chấm công tan làm trong ngày
            if (existingTimeOutLog) {
                return res.status(200).json({
                    isMatch: false,
                    username,
                    userID,
                    message: "Bạn đã hết lượt chấm công trong hôm nay",
                });
            } else {
                // Nếu chưa có bản ghi chấm công tan làm, thêm vào bảng TimeOutLog
                const timeOutUTC = new Date();
                const timeOutLocal = moment(timeOutUTC).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss");

                const timeOutLog = new TimeOutLog({
                    attendanceId: generateUniqueAttendanceId(),
                    userID,
                    username,
                    BiometricMethod: existingTimeInLog.BiometricMethod, // Sử dụng thông tin từ bản ghi TimeInLog
                    TimeOut: timeOutLocal,
                    status: "Chấm công tan làm",
                });

                await timeOutLog.save();

                // Gửi phản hồi về client với kết quả kiểm tra và thông tin username và userID
                return res.status(200).json({
                    isMatch: true,
                    username,
                    userID,
                    message: "Chấm công tan làm thành công",
                });
            }
        } else {
            // Kiểm tra xem đã có bản ghi chấm công tan làm trong ngày chưa
            const existingTimeOutLog = await TimeOutLog.findOne({
                userID,
                TimeOut: { $gte: todayStart, $lt: todayEnd },
            });

            // Nếu đã có bản ghi chấm công tan làm trong ngày
            if (existingTimeOutLog) {
                return res.status(200).json({
                    isMatch: false,
                    username,
                    userID,
                    message: "Bạn đã hết lượt chấm công trong hôm nay",
                });
            } else {
                // Nếu chưa có bản ghi chấm công tan làm, thêm vào bảng TimeInLog
                const attendanceId = generateUniqueAttendanceId();

                const timeInUTC = new Date();
                const timeInLocal = moment(timeInUTC).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss");

                const timeInLog = new TimeInLog({
                    attendanceId,
                    userID,
                    username,
                    BiometricMethod: method,
                    TimeIn: timeInLocal,
                    status: "Chấm công vào làm",
                });

                await timeInLog.save();

                // Gửi phản hồi về client với kết quả kiểm tra và thông tin username và userID
                return res.status(200).json({
                    isMatch: true,
                    username,
                    userID,
                    message: "Chấm công vào làm thành công",
                });
            }
        }
    } catch (error) {
        next(error);
    }
};


export const getAttendanceInfo = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!");
        }

        const userID = req.params.id;

        // Sử dụng find để lấy tất cả các bản ghi từ cả hai bảng
        const [attendanceInInfo, attendanceOutInfo] = await Promise.all([
            TimeInLog.find({ userID: userID }),
            TimeOutLog.find({ userID: userID }),
        ]);

        if (!attendanceInInfo.length && !attendanceOutInfo.length) {
            return res.status(404).json({ error: "Không tìm thấy thông tin chấm công cho người dùng." });
        }

        const attendanceInfo = {
            attendanceIn: attendanceInInfo || null,
            attendanceOut: attendanceOutInfo || null,
        };

        res.status(200).json(attendanceInfo);
    } catch (error) {
        // Xử lý lỗi sử dụng middleware next hoặc gửi phản hồi lỗi
        next(error);
    }
};


export const Search = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!");
        }
        const userID = req.params.id;
        const user = await User.findOne({ userID: userID });
        const { password, ...rest } = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
};

let currentUserId = null;
let currentMethod = null;
let isDataAvailable = false;

// Get userID from UI
export const saveCurrentUserID = (req, res, next) => {
    try {
        const userId = req.params.id;
        const method = req.body.method;
        currentUserId = userId;
        currentMethod = method;
        isDataAvailable = true;

        res.json({ userId: currentUserId, method: currentMethod, message: 'UserID updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Get biometric data from UI to delete in ESP


// GetBiometric API Route for ESP32
export const getBiometric = (req, res, next) => {
    try {
        if (!isDataAvailable) {
            return res.status(404).json({ error: 'Data not available yet' });
        }

        const userId = currentUserId;
        const method = currentMethod;

        // Reset data and flag after sending the response
        res.json({ userId, method });
        currentUserId = null;
        currentMethod = null;
        isDataAvailable = false;
    } catch (error) {
        next(error);
    }
};


