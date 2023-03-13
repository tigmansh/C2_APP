const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    pass: String,
    role: {
      type: String,
      required: true,
      enum: ["seller", "user"],
      default: "user",
    },
  },
  {
    versionKey: false,
  }
);

const Usermodel = mongoose.model("user", userSchema);

module.exports = { Usermodel };
