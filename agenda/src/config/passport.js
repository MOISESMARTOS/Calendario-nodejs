const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  //Signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',//estos datos se obtienen del formulario de signup
    passwordField: 'password',
    passReqToCallback: true// esto envia un req a la funcion que sigue en la linea siguiente
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function(err, user) {
      if (err) {
        return done(err);
      };
      if (user) {
        return done(null, false, req.flash('SignupMessage', 'El email ya existe'))
      } else {
        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(err){
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      };
    });
  }));

  //login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',//estos datos se obtienen del formulario de signup
    passwordField: 'password',
    passReqToCallback: true// esto envia un req a la funcion que sigue en la linea siguiente
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function(err, users) {
      if (err) {
        return done(err);
      };
      if (!users) {
        return done(null, false, req.flash('LoginMessage', 'El usuario (email) no existe'));
      }
      if (!users.validatePassword(password)) {
        return done(null, false, req.flash('LoginMessage', 'El password es incorrecto'));
      }
      return done(null, users);
    });
  }));


}
