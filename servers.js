const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // serves your static HTML and JS

mongoose.connect('mongodb://127.0.0.1:27017/auraDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
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

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
