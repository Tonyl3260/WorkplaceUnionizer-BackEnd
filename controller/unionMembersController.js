const { user_union } = require("../models");
const { Op } = require("sequelize");

// Fetch all members in a union
const getUnionMembers = async (req, res) => {
  try {
    const { unionId } = req.params;

    if (!unionId) {
      return res.status(400).json({ status: "fail", message: "Union ID is required." });
    }

    console.log("Fetching members for union ID:", unionId); // Log the unionId

    const members = await user_union.findAll({
      where: { unionId },
      attributes: ["id", "displayName", "role"],
    });

    if (!members || members.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: `No members found for union ID: ${unionId}` });
    }

    return res.status(200).json({ status: "success", data: members });
  } catch (error) {
    console.error("Error fetching union members:", error.message); // Log the error message
    return res.status(500).json({ status: "error", message: "Failed to fetch members." });
  }
};

// Remove specific members from a union
const removeMembers = async (req, res) => {
    try {
      const { unionId, userIds } = req.body;
  
      if (!unionId || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ status: "fail", message: "Union ID and a list of User IDs are required." });
      }
  
      console.log("Request to remove members:", { unionId, userIds });
  
      // Remove members from the union
      const result = await userUnion.destroy({
        where: {
          unionId,
          userId: userIds, // Matches multiple userIds
        },
      });
  
      console.log("Number of members removed:", result);
  
      if (result === 0) {
        return res.status(404).json({ status: "fail", message: "No members found to remove." });
      }
  
      return res.status(200).json({
        status: "success",
        message: `${result} member(s) removed from the union.`,
      });
    } catch (error) {
      console.error("Error removing members:", error); // Log the error for debugging
      return res.status(500).json({ status: "error", message: "Failed to remove members." });
    }
  };

module.exports = { getUnionMembers, removeMembers };
