const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
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
  console.log({ email, password });
  User.findOne({ email })
    .then((userFact) => {
      console.log(userFact);
      return bcrypt.compare(password, userFact.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        return res.status(201).json({ message: "Login Successful" });
      } else {
        return res.status(401).json({
          message: "Incorrect user credentials!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: "Something went wrong",
      });
    });
};
