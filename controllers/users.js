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

/////////////////////////////////
//////// Get all users

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/////////////////////////////////
//////// Create a new user

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(username);
    // Check if the required fields are present
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object and save it to the database
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const savedUser = await user.save();

    // Generate a JWT token and send it in the response
    const payload = {
      userId: savedUser._id,
      role: savedUser.role,
      timestamp: Date.now(),
    };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/////////////////////////////////
//////// Get a user by their id

const getUserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is authorized to access the resource
    if (req.user.role !== "admin" && req.user.userId !== user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

///////////////////////////////////////
//////// Update the user details

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  // Check if the authenticated user has admin role or the user's ID matches the request
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Update the user details
  User.findByIdAndUpdate(id, { username, email, role }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    });
};

///////////////////////////////////////
//////// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
};
