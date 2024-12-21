const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String }, // URL or path for image uploads
  categories: [{ type: String }], // Array of category names
  tags: [{ type: String }], // Array of tags
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Post", postSchema);
