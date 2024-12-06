const { poll } = require('../models');

// Fetch polls by unionId
const getPollsByUnionId = async (req, res) => {
  try {
    const { unionId } = req.query;

    if (!unionId) {
      return res.status(400).json({ message: "unionId is required" });
    }

    const polls = await poll.findAll({
      where: { unionId },
    });

    if (!polls || polls.length === 0) {
      return res.status(404).json({ message: "No polls found for this union" });
    }

    res.status(200).json({ polls });
  } catch (error) {
    console.error("Error fetching polls by unionId:", error);
    res.status(500).json({ message: "An error occurred while fetching polls" });
  }
};

const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;

    const pollData = await poll.findAll({
      where: { id: pollId },
    });

    if (!pollData || pollData.length === 0) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json({ Poll: pollData[0] });
  } catch (error) {
    console.error("Error fetching poll by ID:", error);
    res.status(500).json({ message: "An error occurred while fetching the poll." });
  }
};

module.exports = { getPollsByUnionId, getPollById };