const pool = require('../database/db');

class Transaction {
    static async create({ userId, gameId, amount, platformFee, ownerAmount, transactionType }) {
        await pool.execute(
            'INSERT INTO transactions (user_id, game_id, amount, platform_fee, owner_amount, transaction_type) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, gameId, amount, platformFee, ownerAmount, transactionType]
        );
    }
}

module.exports = Transaction;