const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

exports.topUp = async (req, res) => {
    const { userId, amount } = req.body;
    try {
        await User.updateWallet(userId, amount);
        await Transaction.create({ userId, amount, transactionType: 'topup' });
        res.status(200).json({ message: 'Top-up successful' });
    } catch (error) {
        res.status(500).json({ error: 'Top-up failed' });
    }
};