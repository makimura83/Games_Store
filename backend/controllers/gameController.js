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