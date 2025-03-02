const pool = require('../database/db');

class Game {
    static async findAll(lang = 'en') {
        let query = 'SELECT * FROM games';
        if (lang === 'th') {
            query = 'SELECT id, title_th AS title, description_th AS description, price, image FROM games';
        } else if (lang === 'jp') {
            query = 'SELECT id, title_jp AS title, description_jp AS description, price, image FROM games';
        }
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async findById(id, lang = 'en') {
        let query = 'SELECT * FROM games WHERE id = ?';
        if (lang === 'th') {
            query = 'SELECT id, title_th AS title, description_th AS description, price, image FROM games WHERE id = ?';
        } else if (lang === 'jp') {
            query = 'SELECT id, title_jp AS title, description_jp AS description, price, image FROM games WHERE id = ?';
        }
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }
}

module.exports = Game;