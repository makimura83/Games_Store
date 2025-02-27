const pool = require('../database/db');

class Purchase {
    static async create({ userId, gameId }) {
        const [result] = await pool.execute(
            'INSERT INTO purchases (user_id, game_id) VALUES (?, ?)',
            [userId, gameId]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await pool.execute(
            'SELECT p.*, g.title, g.image, g.file_path FROM purchases p JOIN games g ON p.game_id = g.id WHERE p.user_id = ?',
            [userId]
        );
        return rows;
    }
}

module.exports = Purchase;