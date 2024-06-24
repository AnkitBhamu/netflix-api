const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    thumb_img: { type: String, default: "" },
    cover_img: { type: String, default: "" },
    name_img: { type: String, default: "" },
    video: { type: String, default: "" },
    duration: { type: String, default: "" },
    age_limit: { type: Number, default: "" },
    genre: { type: String, default: "" },
    year: { type: String, default: "" },
    isSeries: { type: Boolean, default: false },
    trailer: { type: String, default: "" },
  },
  { timestamps: true }
);

// name should be like this for mongoose.
module.exports = mongoose.model("Movies", MovieSchema);
