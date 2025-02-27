const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

let otpStore = {}; // ควรใช้ Redis ใน Production

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userId = await User.create({ username, email, hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: 'OTP required' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { code: otp, expires: Date.now() + 5 * 60 * 1000 }; // หมดอายุ 5 นาที

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Games Store Login',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const stored = otpStore[email];

    if (!stored) {
        return res.status(401).json({ error: 'No OTP found for this email' });
    }
    if (Date.now() > stored.expires) {
        delete otpStore[email];
        return res.status(401).json({ error: 'OTP has expired' });
    }
    if (stored.code === otp) {
        const user = await User.findByEmail(email);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        delete otpStore[email];
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
};