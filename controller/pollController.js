const { Poll, UserVote, union } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Create a new poll
const createPoll = async (req, res) => {
  try {
    const { unionId, name, description, totalEmployees } = req.body;

    if (!unionId || !name || !description || totalEmployees === undefined) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the union exists
    const existingUnion = await union.findByPk(unionId);
    if (!existingUnion) {
      return res.status(404).json({ error: 'Union not found.' });
    }

    // Create the poll
    const newPoll = await Poll.create({
      id: uuidv4(),
      name,
      description,
      unionId,
      totalEmployees,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Poll created successfully.',
      data: {
        id: newPoll.id,
        ...newPoll.dataValues,
      },
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return res.status(500).json({ error: 'An error occurred while creating the poll.' });
  }
};

// Get polls for a union
const getPollsByUnion = async (req, res) => {
  try {
    const { unionId } = req.query;

    if (!unionId) {
      return res.status(400).json({ error: 'Union ID is required.' });
    }

    const polls = await Poll.findAll({ where: { unionId } });

    if (!polls || polls.length === 0) {
      return res.status(404).json({ error: 'No polls found for this union.' });
    }

    return res.status(200).json({
      status: 'success',
      data: polls,
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return res.status(500).json({ error: 'An error occurred while fetching polls.' });
  }
};

// Vote on a poll
const voteOnPoll = async (req, res) => {
  try {
    const { userId, pollId, vote } = req.body;

    if (!userId || !pollId || !vote) {
      return res.status(400).json({ error: 'User ID, poll ID, and vote are required.' });
    }

    // Check if the user has already voted
    const existingVote = await UserVote.findOne({ where: { userId, pollId } });

    if (existingVote) {
      return res.status(400).json({ error: 'User has already voted on this poll.' });
    }

    // Check if the poll exists
    const poll = await Poll.findByPk(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    // Update poll counts
    if (vote === 'yes') {
      poll.yesCount += 1;
    } else if (vote === 'no') {
      poll.noCount += 1;
    } else {
      return res.status(400).json({ error: 'Invalid vote option. Must be "yes" or "no".' });
    }

    await poll.save();

    // Save the user's vote
    await UserVote.create({ id: uuidv4(), userId, pollId, vote });

    return res.status(200).json({
      status: 'success',
      message: 'Vote submitted successfully.',
      data: {
        yesCount: poll.yesCount,
        noCount: poll.noCount,
      },
    });
  } catch (error) {
    console.error('Error voting on poll:', error);
    return res.status(500).json({ error: 'An error occurred while voting on the poll.' });
  }
};

module.exports = {
  createPoll,
  getPollsByUnion,
  voteOnPoll,
};
