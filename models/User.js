const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  username: String,
  discriminator: String,
  avatar: String,
  administrator: Boolean,
  servers: Array,
  tokens: Array
}, { timestamps: true });

/**
 * Helper method for getting user's avatar.
 */
userSchema.methods.getAvatar = function avatar() {
  return `https://cdn.discordapp.com/avatars/${this.user_id}/${this.avatar}.png`;
};

/**
 * Helper method for getting a user's servers with their icons.
 */
userSchema.methods.getServers = function avatar() {
  let icons = [];
  this.servers.forEach(server => {
    icons.push({
      name: server.name,
      icon: `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
    });
  });
  return icons;
};

/**
 * Helper method for getting user's sign-up date.
 */
userSchema.methods.getCreated = function created() {
  return moment(this.createdAt).format('YYYY-MM-DD');
}

/**
 * Helper method to return whether user has token type.
 */
userSchema.methods.hasToken = function(provider) {
  if (_.find(this.tokens, { kind: provider })) {
    return true;
  }
  else return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
