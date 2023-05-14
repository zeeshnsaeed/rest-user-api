const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  createUser,
} = require("../controllers/users");
const { requireAuth, requireAdmin } = require("../auth/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", requireAuth, requireAdmin, getUsers);
router.post("/user", requireAuth, requireAdmin, createUser);

module.exports = router;
