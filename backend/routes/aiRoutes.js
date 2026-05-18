const express = require('express');
const { getRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/recommend', protect, getRecommendations);

module.exports = router;
