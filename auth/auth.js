const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization header not present" });
  }

  try {
    const decodedToken = jwt.verify(token, "secret");
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

const requireAdmin = (req, res, next) => {
  const { role } = req.user;

  console.log(role);

  if (role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
