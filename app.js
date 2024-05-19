const express = require('express');
const mongoose =require('mongoose');
const path = require('path');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.json({ message: 'Welcome! You have successfully registered.' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

   // Compare the passwords
   const isValid = await bcrypt.compare(password, user.password);

   if (!isValid) {
     res.status(401).json({ message: 'Invalid email or password.' });
     return;
   }
 
   res.json({ message: 'Welcome! You have successfully logged in.' });
 });
 

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});