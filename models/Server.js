const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  server_id: { type: String, unique: true },
  name: String,
  icon: String
}, { timestamps: true });

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;