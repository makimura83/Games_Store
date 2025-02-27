const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/me', authMiddleware, userController.getUserProfile);
router.post('/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;