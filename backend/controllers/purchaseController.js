const Purchase = require('../models/purchaseModel');
const Transaction = require('../models/transactionModel');
const Game = require('../models/gameModel');
const User = require('../models/userModel');

exports.purchaseGame = async (req, res) => {
    const { userId, gameId } = req.body;
    const platformFeeRate = 0.10;
    try {
        const game = await Game.findById(gameId);
        const user = await User.findById(userId);
        const totalAmount = game.price;
        const platformFee = totalAmount * platformFeeRate;
        const ownerAmount = totalAmount - platformFee;

        if (user.wallet < totalAmount) return res.status(400).json({ error: 'Insufficient funds' });

        await User.updateWallet(userId, -totalAmount);
        await Purchase.create({ userId, gameId });
        await Transaction.create({ userId, gameId, amount: totalAmount, platformFee, ownerAmount, transactionType: 'purchase' });

        res.status(200).json({ message: 'Game purchased successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Purchase failed' });
    }
};

exports.getUserPurchases = async (req, res) => {
    const { userId } = req.params;
    try {
        const purchases = await Purchase.findByUser(userId);
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
};