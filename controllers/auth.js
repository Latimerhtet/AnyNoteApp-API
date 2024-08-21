const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorsMsg: errors.array(),
    });
  }
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashPassword) => {
      return User.create({
        username,
        password: hashPassword,
        email,
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        id: result._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ message: "hashing password failed! check again!" });
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorsMsg: errors.array(),
    });
  }
  const { email, password } = req.body;

  let userData;
  User.findOne({ email })
    .then((userFact) => {
      userData = userFact;
      return bcrypt.compare(password, userFact.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({
          message: "Incorrect user credentials!",
        });
      }
      const token = jwt.sign(
        { email: userData.email, userId: userData._id },
        process.env.JWT_TOKEN,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({
          token,
          id: userData._id,
          user_mail: userData.email,
          username: userData.username,
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: "Something went wrong",
      });
    });
};

exports.checkStatus = (req, res, next) => {
  const authHeader = req.get("Authorization");
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
    return res.json("ok");
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Not authenticated!" });
  }
};
