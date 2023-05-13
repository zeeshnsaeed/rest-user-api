const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUsers } = require("../controllers/users");
const { requireAuth, requireAdmin } = require("../auth/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", requireAuth, requireAdmin, getUsers);

module.exports = router;
