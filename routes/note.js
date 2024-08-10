const express = require("express");
const router = express.Router();
const notesControllers = require("../controllers/note");
const { body } = require("express-validator");
// GET /notes
router.get("/notes", notesControllers.getNotes);

// POST /create
router.post(
  "/create",
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .isLength({ max: 20 })
      .withMessage("Title is too long"),
    body("content").isLength({ min: 5 }).withMessage("Title is too short"),
  ],
  notesControllers.createNotes
);

// GET /notes/:id
router.get("/notes/:id", notesControllers.getNote);

// POST /edit/:id
router.post("/edit/:id", notesControllers.editNote);

// DELETE /delete/:id
router.delete("/delete/:id", notesControllers.deleteNote);

module.exports = router;
