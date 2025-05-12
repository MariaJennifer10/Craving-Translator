const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // For now, we'll use "anonymous"
  food: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);