const Game = require('../models/gameModel');
const GameVersion = require('../models/gameVersionModel');

exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

exports.getGameById = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await Game.findById(id);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game' });
    }
};

exports.getGameVersions = async (req, res) => {
    const { gameId } = req.params;
    try {
        const versions = await GameVersion.findByGameId(gameId);
        res.json(versions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
};

exports.downloadGame = async (req, res) => {
    const { gameId, versionId } = req.params;
    try {
        const version = await GameVersion.findById(versionId);
        if (!version) return res.status(404).json({ error: 'Version not found' });

        const filePath = path.join(__dirname, '..', version.file_path);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Download failed' });
    }
};
const Game = require('../models/gameModel');
const GameVersion = require('../models/gameVersionModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

exports.getAllGames = async (req, res) => {
    try {
        const lang = req.language || 'en';
        let games;
        if (lang === 'th') {
            games = await pool.execute('SELECT id, title_th AS title, description_th AS description, price, image FROM games');
        } else if (lang === 'jp') {
            games = await pool.execute('SELECT id, title_jp AS title, description_jp AS description, price, image FROM games');
        } else {
            games = await pool.execute('SELECT * FROM games');
        }
        res.json(games[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

exports.getGameById = async (req, res) => {
    const { id } = req.params;
    try {
        const lang = req.language || 'en';
        let game;
        if (lang === 'th') {
            [game] = await pool.execute('SELECT id, title_th AS title, description_th AS description, price, image FROM games WHERE id = ?', [id]);
        } else if (lang === 'jp') {
            [game] = await pool.execute('SELECT id, title_jp AS title, description_jp AS description, price, image FROM games WHERE id = ?', [id]);
        } else {
            [game] = await pool.execute('SELECT * FROM games WHERE id = ?', [id]);
        }
        if (!game[0]) return res.status(404).json({ error: 'Game not found' });
        res.json(game[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game' });
    }
};

// ฟังก์ชันอื่น ๆ เหมือนเดิม (getGameVersions, downloadGame, createGame, uploadGameVersion)