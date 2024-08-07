const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const notesRoutes = require("./routes/note");
// body parser
app.use(bodyparser.json());

// routes
app.use(notesRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080);
    console.log("Connected to mongoDB and server is running on Port 8080!");
  })
  .catch((err) => {
    console.log(err);
  });
