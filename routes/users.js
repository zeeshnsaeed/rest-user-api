const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { requireAuth, requireAdmin } = require("../auth/auth");

router.post("/register", registerUser); //Endpoint 1
router.post("/login", loginUser); //Endpoint 2

router.get("/", requireAuth, requireAdmin, getUsers); //Endpoint 3
router.post("/user", requireAuth, requireAdmin, createUser); //Endpoint 4

router.get("/user/:id", requireAuth, getUserByID); //Endpoint 5
router.put("/user/:id", requireAuth, updateUser); //Endpoint 6

router.delete("/user/:id", requireAuth, deleteUser); //Endpoint 7

module.exports = router;
