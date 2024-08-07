const { validationResult } = require("express-validator");
exports.getNotes = (req, res, next) => {
  res.status(200).json({
    title: "first notes",
    content: "first note content",
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
  res.status(201).json({
    message: "Note created!",
    data: { title, content },
  });
};
