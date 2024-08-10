const { model, Schema } = require("mongoose");

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    content: {
      type: String,
      required: true,
      minLength: 5,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
  },
  { timestamps: true }
);

const noteModel = model("Note", notesSchema);

module.exports = noteModel;
