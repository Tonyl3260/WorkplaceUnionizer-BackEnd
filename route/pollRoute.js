const express = require("express");
const { getPollsByUnion, voteOnPoll } = require("../controller/pollController");
const router = express.Router();

router.get("/", getPollsByUnion);
router.post("/vote", voteOnPoll); 

module.exports = router;
