import express from "express";
import { deleteUser, test, updateUser, getUser, amountUser, ProfileDetail, AttendanceDetail, saveBiometric, testApi, Search, checkAttendance, getAttendanceInfo, getBiometric, saveCurrentUserID, deleteBiometricESP, ESPToDeleteBiometric } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.get('/test-api', testApi);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/get-user', verifyToken, getUser)
router.get('/amount-user', verifyToken, amountUser)
router.get('/profile-detail/:id', verifyToken, ProfileDetail)
router.get('/attendance-detail/:id', verifyToken, AttendanceDetail)

router.post('/current-userid/:id', saveCurrentUserID)
router.get('/get-biometric', getBiometric)
// router.post('/save-biometric-data', verifyToken, saveBiometricData);
router.post('/save-biometric/:id', saveBiometric)
router.get('/update-biometric/:id', saveBiometric)
router.delete('/delete-biometric/:id', ESPToDeleteBiometric)
router.get('/get-delete-data', deleteBiometricESP)
router.post('/check-attendance', checkAttendance);


router.get('/get-attendance-info/:id', getAttendanceInfo)
router.post('/search/:id', Search)




export default router;