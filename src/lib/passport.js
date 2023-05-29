const passport = require('passport')
const Strategy = require('passport-local').Strategy
const helpers = require('./helpers')
const pool = require('../database')

passport.use('local.signin', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE idusuario = ? and contraseña = ?', [username,password]);
    if (rows.length > 0) {
      const user = rows[0];
      return done(null, user, req.flash('success', 'Welcome ' + user.idusuario));
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists or wrote incorrect data.'));
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.idusuario);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE idusuario = ?', [id]);
    done(null, rows[0]);
  });