const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/topup', authMiddleware, walletController.topUp);

module.exports = router;