const express = require('express');
const router = express.Router();

const likeCtrl = require('../controllers/like');

// routes
router.get('/', likeCtrl.findAllLikes);
router.post('/', likeCtrl.createLike);

module.exports = router;