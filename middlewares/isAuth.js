const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const tokenMatch = jwt.verify(token, process.env.JWT_TOKEN);
    if (!tokenMatch) {
      return res.status(401).json({ message: "Not authenticated!" });
    }
    req.userId = tokenMatch.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Not authenticated!" });
  }
};

module.exports = isAuth;
