const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const errorHandler = (req, res) => {
  console.error("error");
  res.status(500).json({ error: "Internal Server Error" });
};

router.post("/register", async (req, res) => {
  try {
    console.log("stipend");
    const { name, email, mobile, password } = req.body;
    console.log(name, email, mobile, password);
    if (!name || !email || mobile || !password) {
      return res.sendStatus(500).json({ error: "All Fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.send(500).json({ error: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    res.json({ success: true, user: email, name: name });
  } catch (error) {
    console.log("error=== ", error);
    errorHandler(res, error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.send(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.send(401).json({ error: "Invalid Email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.send(401).jsonp({ error: "Invalid Email or password" });
    }
    const tokenPayload = { userId: user._id };
    // const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    const token = await generateToken(tokenPayload);

    res.json({ success: true, token, recruiterName: user.name, user: email });
  } catch (error) {
    console.log("error=== ", error);
    errorHandler(res, error);
  }
});

module.exports = router;
