const passport = require('passport');
const LocalStrategy = require('passport-local');

const { ADMIN } = require('../config/config')

module.exports = (app) => {

    // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, Number(user.ID));
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    // populate req.user
    // ADMIN = { ID: '1', USERNAME: 'cajero', PASSWORD: 'admin' }
    done(null, ADMIN);
  });

  // Configure strategy to be use for local login
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        if (username !== ADMIN.USERNAME) return done(null, false, { message: 'Incorrect username or password.' });
        if (password !== ADMIN.PASSWORD) return done(null, false, { message: 'Incorrect username or password.' });
        return done(null, ADMIN);
      } catch(err) {
        return done(err);
      }
    }
  ));

  return passport;

}