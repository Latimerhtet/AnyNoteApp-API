const { validationResult } = require("express-validator");
const Note = require("../models/note");
exports.getNotes = (req, res, next) => {
  Note.find()
    .sort({ createdAt: -1 })
    .then((notes) => {
      return res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({
        message: "Something wrong with getting all notes",
      });
    });
};

exports.createNotes = (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation Failed",
      errMessages: errors.array(),
    });
  }
  Note.create({
    title,
    content,
  })
    .then(() => {
      return res.status(201).json({
        message: "Note created!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong with creating a note!",
      });
    });
};

// getting a note
exports.getNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .json({ message: "Something went wrong with finding a note" });
    });
};

//editing a note
exports.editNote = (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  Note.findById(id)
    .then((note) => {
      note.title = title;
      note.content = content;
      note.save().then(() => {
        return res.status(201).json({
          message: "Editing success!",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(404)
        .json({ message: "Something went wrong with editing a note" });
    });
};

// deleting a note
exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({
        message: "Deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(404)
        .json({ message: "Something went wrong with deleting a note" });
    });
};
