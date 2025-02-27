const pool = require('../database/db');

class GameVersion {
    static async findByGameId(gameId) {
        const [rows] = await pool.execute(
            'SELECT id, version, release_date FROM game_versions WHERE game_id = ?',
            [gameId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT file_path FROM game_versions WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = GameVersion;