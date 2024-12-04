const express = require('express');
const { createPoll, voteOnPoll, updateEmployeeCount } = require('../controller/pollController');

const router = express.Router();

router.post('/create', createPoll);
router.post('/vote', voteOnPoll);
router.post('/updateEmployeeCount', updateEmployeeCount);

module.exports = router;
