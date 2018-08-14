const passport = require('passport');
const { Strategy: DiscordStrategy } = require('passport-discord');
var _ = require('lodash');

const User = require('../models/User');
const Server = require('../models/Server');
const Settings = require('../models/Settings');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * TODO:
 * - update Discord stragety to use authorized servers from settings
 */

/**
 * Sign in with Discord
 */
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_ID,
  clientSecret: process.env.DISCORD_SECRET,
  callbackURL: '/auth/discord/callback',
  scope: ['identify', 'guilds'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  //console.log(profile);
  if (req.user) {
    //user is already logged in?
    console.log('req.user');
  }
  else {
    //var token = _.find(req.user.tokens, { kind: 'twitter' });
    User.findOne({ user_id: profile.id }).exec( (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        //update the existing user
        existingUser.username = profile.username;
        existingUser.discriminator = profile.discriminator;
        existingUser.avatar = profile.avatar;
        existingUser.servers = profile.guilds;
        existingUser.save((err) => {
          done(err, existingUser);
        });
        return done(null, existingUser);
      }
      else {
        //create a new user
        const user = new User();
        user.user_id = profile.id;
        user.username = profile.username;
        user.discriminator = profile.discriminator;
        user.avatar = profile.avatar;
        user.servers = profile.guilds;
        user.administrator = false;
        user.tokens.push({ kind: 'discord', accessToken });
        user.save((err) => {
          done(err, user);
        });
        return done(null, user);
      }
    });
  }
}));


/**
 * Discord old authorized servers logic
 */
/* passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_ID,
  clientSecret: process.env.DISCORD_SECRET,
  callbackURL: '/auth/discord/callback',
  scope: ['identify', 'guilds'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  //console.log(profile);
  if (req.user) {
    //user is already logged in?
    console.log('req.user');
  }
  else {
    let userServers = [];
    //let authorized = [];
    profile.guilds.forEach(guild => userServers.push(guild.id));
    //console.log(servers);

    Server.find({ server_id: { $in: userServers } }, (err, existingServers) => {
      //get a list of user's servers that are also authorized servers
      if (err) { return done(err); }
      if (existingServers.length) {
        let authorizedServers = [];
        //console.log(`existingServers: ${existingServers}`);

        profile.guilds.forEach(server => {
          let match = _.find(existingServers, { server_id: server.id });
          if (match) {
            //console.log(`match on: ${server.id}`);
            authorizedServers.push(server);
            Server.findOneAndUpdate({ server_id: server.id }, { name: server.name, icon: server.icon }, function(err, doc){
                if (err) { return done(err); }
            });
          }
        });

        //var token = _.find(req.user.tokens, { kind: 'twitter' });
        User.findOne({ user_id: profile.id }).exec( (err, existingUser) => {
          if (err) { return done(err); }
          if (existingUser) {
            //update the existing user
            existingUser.username = profile.username;
            existingUser.discriminator = profile.discriminator;
            existingUser.avatar = profile.avatar;
            existingUser.servers = authorizedServers;
            existingUser.save((err) => {
              done(err, existingUser);
            });
            return done(null, existingUser);
          }
          else {
            //create a new user
            const user = new User();
            user.user_id = profile.id;
            user.username = profile.username;
            user.discriminator = profile.discriminator;
            user.avatar = profile.avatar;
            user.servers = authorizedServers;
            user.administrator = false;
            user.tokens.push({ kind: 'discord', accessToken });
            user.save((err) => {
              done(err, user);
            });
            return done(null, user);
          }
        });

      }
      else {
        req.flash('errors', { msg: 'You are not a member of an authorized server.' });
        done(err);
      }
    });
  }
})); */

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};