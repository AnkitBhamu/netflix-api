const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String },
    genre: { type: String },
    content: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lists", ListSchema);
