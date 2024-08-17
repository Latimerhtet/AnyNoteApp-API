const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_User_img: {
      type: String,
    },
    notes: {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);

module.exports = userModel;
