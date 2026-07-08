const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // 1. Find the user by their email
      User.findOne({ email: email.toLowerCase() })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }

          // 2. If user is found, compare the passwords
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(err => done(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
  });
};