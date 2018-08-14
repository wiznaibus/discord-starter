const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  name: String,
  value: String
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;