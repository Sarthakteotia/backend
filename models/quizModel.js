const mongoose = require("mongoose");
const User = require("./user");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  answer: String,
});

const quizSchema = new mongoose.Schema(
  {
    title: String,
    questions: [questionSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { Quiz };
