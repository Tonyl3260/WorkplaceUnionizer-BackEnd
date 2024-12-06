const express = require('express');
const { createPoll, getPollsByUnion, voteOnPoll } = require('../controller/pollController');
const router = express.Router();

router.post('/create', createPoll);
router.get('/', getPollsByUnion);
router.post('/vote', voteOnPoll);

module.exports = router;
