const { Poll, UserVote } = require('../models');

const createPoll = async (req, res) => {
  try {
    const { question, totalEmployees } = req.body;

    if (!question || !totalEmployees) {
      return res.status(400).json({ error: 'Question and total employees are required.' });
    }

    const newPoll = await Poll.create({
      question,
      totalEmployees,
    });

    return res.status(201).json({ data: newPoll });
  } catch (error) {
    console.error('Error creating poll:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const voteOnPoll = async (req, res) => {
  try {
    const { userId, pollId, vote } = req.body;

    if (!userId || !pollId || !vote) {
      return res.status(400).json({ error: "User ID, poll ID, and vote are required." });
    }

    const existingVote = await UserVote.findOne({ where: { userId, pollId } });

    if (existingVote) {
      return res.status(400).json({ error: "User has already voted on this poll." });
    }

    const poll = await Poll.findByPk(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    await UserVote.create({ userId, pollId, vote });

    if (vote === "yes") {
      poll.yesCount += 1;
    } else if (vote === "no") {
      poll.noCount += 1;
    }

    await poll.save();

    return res.status(200).json({ message: "Vote registered successfully.", data: poll });
  } catch (error) {
    console.error("Error voting on poll:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const updateEmployeeCount = async (req, res) => {
    try {
      const { pollId, totalEmployees } = req.body;
  
      if (!pollId || !totalEmployees) {
        return res.status(400).json({ error: 'Poll ID and total employees are required.' });
      }
  
      const poll = await Poll.findByPk(pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found.' });
      }
  
      poll.totalEmployees = totalEmployees;
      await poll.save();
  
      return res.status(200).json({ message: 'Employee count updated successfully.', data: poll });
    } catch (error) {
      console.error('Error updating employee count:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

module.exports = {createPoll, voteOnPoll, updateEmployeeCount}