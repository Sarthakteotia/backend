const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

module.exports = { QuizSubmission };
