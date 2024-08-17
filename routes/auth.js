const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authControllers = require("../controllers/auth");
const User = require("../models/user");
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email!")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((returnEmail) => {
          if (returnEmail) {
            return Promise.reject("Email is already registered!");
          }
        });
      }),
    body("username")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Username is too shot")
      .isLength({ max: 40 })
      .withMessage("Username is too long")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((returnUser) => {
          if (returnUser) {
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password is weak!"),
  ],
  authControllers.register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid!")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Email doesn't exist!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password is weak"),
  ],
  authControllers.login
);

module.exports = router;
