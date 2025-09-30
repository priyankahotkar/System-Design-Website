const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/auth");
const {
  getMySolvedQuestions,
  isQuestionSolved,
  markQuestionAsSolved,
  unmarkQuestionAsSolved,
} = require("../controllers/solvedQuestionsController");

// Get all solved questions for the logged-in user
router.get("/me", verifyFirebaseToken, getMySolvedQuestions);

// Check if a specific question is solved
router.get("/:id/solved", verifyFirebaseToken, isQuestionSolved);

// Mark a question as solved
router.post("/:id/solved", verifyFirebaseToken, markQuestionAsSolved);

// Unmark a question as solved
router.delete("/:id/solved", verifyFirebaseToken, unmarkQuestionAsSolved);

module.exports = router;
