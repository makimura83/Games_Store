const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.get('/versions/:gameId', authMiddleware, gameController.getGameVersions);
router.get('/download/:gameId/:versionId', authMiddleware, gameController.downloadGame);

module.exports = router;