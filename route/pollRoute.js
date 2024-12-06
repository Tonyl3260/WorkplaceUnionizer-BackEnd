const express = require('express');
const router = express.Router();
const { getPollById , getPollsByUnionId } = require('../controller/pollController'); 

router.get('/:pollId', getPollById);
router.get('/', getPollsByUnionId);

module.exports = router;
