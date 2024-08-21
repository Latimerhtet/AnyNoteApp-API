const { validationResult } = require("express-validator");

// note model import
const Note = require("../models/note");

// utils import
const { unlink } = require("../utils/unlink");
exports.getNotes = (req, res, next) => {
  const pageNo = req.query.page || 1;
  const notePerPage = 3;
  let totalNotes;
  let totalPages;
  Note.countDocuments()
    .then((count) => {
      totalNotes = count;
      totalPages = Math.ceil(totalNotes / notePerPage);
      return Note.find()
        .populate("author", "username")
        .sort({ createdAt: -1 })
        .skip((pageNo - 1) * notePerPage)
        .limit(notePerPage)
        .then((notes) => {
          return res.status(200).json({ notes, totalNotes, totalPages });
        });
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
  const userId = req.userId;
  const profile_img = req.file;
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
    profile_img: profile_img ? profile_img.path : undefined,
    author: userId,
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
  const cover_img = req.file;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      note.title = title;
      note.content = content;
      if (cover_img) {
        if (note.profile_img) {
          unlink(note.profile_img);
        }
        note.profile_img = cover_img.path;
      }
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
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      if (note.profile_img) {
        unlink(note.profile_img);
      }
      return Note.findByIdAndDelete(id).then(() => {
        return res.status(204).json({
          message: "Deleted successfully",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(404)
        .json({ message: "Something went wrong with deleting a note" });
    });
};
