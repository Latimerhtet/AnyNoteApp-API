const { model, Schema } = require("mongoose");

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 80,
    },
    content: {
      type: String,
      required: true,
      minLength: 5,
    },
    profile_img: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const noteModel = model("Note", notesSchema);

module.exports = noteModel;
