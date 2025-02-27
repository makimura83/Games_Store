const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

exports.uploadAvatar = async (req, res) => {
    const { file } = req;
    const token = req.user.id;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const avatarPath = path.join('uploads', `avatar_${token}_${Date.now()}.jpg`);
    const fullPath = path.join(__dirname, '..', avatarPath);

    // บันทึกไฟล์
    fs.writeFileSync(fullPath, file.buffer);

    try {
        await User.updateAvatar(token, avatarPath);
        res.status(200).json({ message: 'Avatar updated successfully', avatar: avatarPath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update avatar' });
    }
};