const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SavedItem', savedItemSchema);
