const express = require("express");
const { getUnionMembers, removeMembers } = require("../controller/unionMembersController");
const router = express.Router();

// Fetch all union members
router.get("/:unionId/members", getUnionMembers);

// Remove members from a union
router.post("/remove-members", removeMembers);

module.exports = router;
