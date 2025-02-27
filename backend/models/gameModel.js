const pool = require('../database/db');

class Game {
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM games');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM games WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Game;