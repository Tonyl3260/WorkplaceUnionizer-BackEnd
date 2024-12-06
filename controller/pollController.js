const { poll, user_vote } = require("../models"); 

// Get polls by union ID
const getPollsByUnion = async (req, res) => {
  try {
    const { unionId } = req.query;

    if (!unionId) {
      return res.status(400).json({ error: "Union ID is required." });
    }

    const polls = await poll.findAll({
      where: { unionId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: polls });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return res.status(500).json({ error: "An error occurred while fetching polls." });
  }
};

// Add a vote to a poll
const voteOnPoll = async (req, res) => {
  try {
    const { userId, pollId, vote } = req.body;

    if (!userId || !pollId || !vote) {
      return res.status(400).json({ error: "User ID, Poll ID, and vote are required." });
    }

    // Check if the user already voted
    const existingVote = await user_vote.findOne({ where: { userId, pollId } });

    if (existingVote) {
      return res.status(400).json({ error: "User has already voted on this poll." });
    }

    const targetPoll = await poll.findByPk(pollId);
    if (!targetPoll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    await user_vote.create({ userId, pollId, vote });

    if (vote === "yes") {
      targetPoll.yesCount += 1;
    } else if (vote === "no") {
      targetPoll.noCount += 1;
    }

    await targetPoll.save();

    return res.status(200).json({ message: "Vote registered successfully.", data: targetPoll });
  } catch (error) {
    console.error("Error voting on poll:", error);
    return res.status(500).json({ error: "An error occurred while voting on the poll." });
  }
};

module.exports = {
  getPollsByUnion,
  voteOnPoll,
};
