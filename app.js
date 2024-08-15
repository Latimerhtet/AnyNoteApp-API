const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyparser = require("body-parser");
const notesRoutes = require("./routes/note");
const path = require("path");
// body parser
app.use(bodyparser.json());
const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});
const fileFilterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};
app.use(
  multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single(
    "profile_img"
  )
);
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// routes
app.use(notesRoutes);

// connecting to mongoDB and running server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080);
    console.log("Connected to mongoDB and server is running on Port 8080!");
  })
  .catch((err) => {
    console.log("database is not connected!");
    console.log(err);
  });
