// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
// const jobRoutes = require('./routes/jobs');

// Create Express app
const app = express();

// Middleware - Enable CORS
app.use(cors());

// Middleware - Parse JSON request body
app.use(bodyParser.json());
app.use(express.json());
// Middleware - Parse URL-encoded request body
// app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
// const mongoose = require('mongoose');

mongoose
  .connect(
    "mongodb+srv://sarthak:sarthak123@cluster0.iay33so.mongodb.net/quizApp?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
// app.use("/api/job", jobRoutes);
app.get("/", async (req, res) => {
  res.status(200).json("Server is up and running");
});
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
