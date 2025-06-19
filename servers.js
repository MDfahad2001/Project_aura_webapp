const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auraDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Define User schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).send('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Invalid password');

  res.send('success');
});

// Start server
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
