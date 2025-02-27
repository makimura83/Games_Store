const pool = require('../database/db');

class User {
    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async create({ username, email, password }) {
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return result.insertId;
    }

    static async updateWallet(userId, amount) {
        await pool.execute('UPDATE users SET wallet = wallet + ? WHERE id = ?', [amount, userId]);
    }
    
    static async updateAvatar(userId, avatarPath) {
        await pool.execute('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId]);
    }
}

module.exports = User;
