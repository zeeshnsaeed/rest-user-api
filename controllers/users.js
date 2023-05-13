const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

///////////////////////////////
//////// Register User

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

module.exports = {
  registerUser,
};
