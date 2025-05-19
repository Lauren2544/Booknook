const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  rating: Number,
  quotes: [String],
  notes: String,
  colour: String,
  image: String,
  year: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // to track per user
});

module.exports = mongoose.model("Book", BookSchema);
