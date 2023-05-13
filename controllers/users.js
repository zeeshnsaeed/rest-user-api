const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//////////////////////////////////
//////// Register User Controller

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  try {
    // Save the user to the database
    await user.save();

    // If user is valid, create a JWT token and send it in the response
    const payload = {
      userId: user.id,
      role: user.role,
      timestamp: Date.now(),
    };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

    // Send the response with the JWT
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/////////////////////////////////
//////// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are present
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // If user is valid, create a JWT token and send it in the response
  const payload = {
    userId: user.id,
    role: user.role,
    timestamp: Date.now(),
  };
  const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

  // Send the token as a response
  res.json({ token });
};

module.exports = {
  registerUser,
  loginUser,
};
