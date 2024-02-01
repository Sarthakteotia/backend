const express = require("express");
const { Quiz } = require("../models/quizModel");
// const data = require("./quizData.json");
const router = express.Router();
const auth = require("../utils/jwt");
const { QuizSubmission } = require("../models/submit");

router.post("/create-quiz", auth.verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    const { title, questions } = req.body;
    const newQuiz = new Quiz({
      title,
      questions,
      user: userId,
    });
    const savedQuiz = await newQuiz.save();
    res.status(201).json({ message: `Quiz created with ID: ${savedQuiz._id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getQuiz", auth.verifyToken, async (req, res) => {
  try {
    const { userId } = req;

    const quizzes = await Quiz.find({ user: userId });
    let questionsCount = 0;
    const quizCount = quizzes.length;

    quizzes.forEach((quiz) => {
      questionsCount += quiz.questions.length;
    });

    console.log(questionsCount);

    res
      .status(201)
      .json({ message: "User quizzes:", quizzes, questionsCount, quizCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAllQuiz", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    let questionsCount = 0;
    const quizCount = quizzes.length;
    let quizIds = [];
    quizzes.forEach((quiz) => {
      questionsCount += quiz.questions.length;
      quizIds.push(quiz._id);
    });
    const submitQuizRecords = await QuizSubmission.find({
      quiz: { $in: quizIds },
    });
    console.log(questionsCount);
    res.status(201).json({
      message: "User quizzes:",
      quizzes,
      questionsCount,
      quizCount,
      submitQuizRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:quizId", auth.verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId, user: userId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found or unauthorized to delete." });
    }

    await quiz.deleteOne();

    res.status(200).json({ message: "Quiz deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:quizId", auth.verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findOne({ _id: quizId, user: userId });
    console.log("quiz=== ", quiz);
    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found or unauthorized to edit." });
    }

    if (title) {
      quiz.title = title;
    }
    if (questions) {
      quiz.questions = questions;
    }

    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully.", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/submitQuiz", async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;

    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let correctAnswersCount = 0;
    quiz.questions.forEach((question) => {
      if (
        userAnswers[question._id] &&
        userAnswers[question._id] === question.answer
      ) {
        correctAnswersCount++;
      }
    });

    const filter = { quiz: quizId };
    const update = { $inc: { count: 1 } };

    const options = {
      upsert: true,
      new: true,
    };

    const updatedSubmission = await QuizSubmission.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();

    res.status(200).json({
      message: "Quiz submitted successfully",
      correctAnswersCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:quizId", async (req, res) => {
  try {
    // const { userId } = req;
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found or unauthorized to delete." });
    }

    // await quiz.deleteOne();

    res.status(200).json({ message: "Quiz fetched", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/impression/:quizId", auth.verifyToken, async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await QuizSubmission.findOne({ quiz: quizId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found or unauthorized to delete." });
    }

    res.status(200).json({ message: "Quiz deleted successfully.", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
