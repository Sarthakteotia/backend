// index.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true, // if you're using cookies or sessions
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
