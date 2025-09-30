const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// GET /api/solvedQuestions/solved/me
const getMySolvedQuestions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("solvedQuestions");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, data: user.solvedQuestions || [] });
});

// GET /api/solvedQuestions/:id/solved
const isQuestionSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id).select("solvedQuestions");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const isSolved = (user.solvedQuestions || []).includes(id);
  res.status(200).json({ success: true, data: { isSolved } });
});

// POST /api/solvedQuestions/:id/solved
const markQuestionAsSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id).select("solvedQuestions");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.solvedQuestions.includes(id)) {
    user.solvedQuestions.push(id);
    await user.save();
  }

  res.status(200).json({ success: true, data: user.solvedQuestions });
});

// DELETE /api/solvedQuestions/:id/solved
const unmarkQuestionAsSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id).select("solvedQuestions");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.solvedQuestions = user.solvedQuestions.filter(q => q !== id);
  await user.save();

  res.status(200).json({ success: true, data: user.solvedQuestions });
});

module.exports = {
  getMySolvedQuestions,
  isQuestionSolved,
  markQuestionAsSolved,
  unmarkQuestionAsSolved,
};
