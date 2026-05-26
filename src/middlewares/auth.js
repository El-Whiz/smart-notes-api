const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(payload.userId).select("_id email name goal style pace");

    if (!user) {
      return res.status(401).json({ error: "Token is valid but user does not exist." });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      goal: user.goal,
      style: user.style,
      pace: user.pace,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
