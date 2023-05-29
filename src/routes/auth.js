const express = require('express')
const router = express.Router()
const passport=require('passport')



router.get('/login', (req, res) => {
    res.render("login/loginvista")
})

router.get('/logout',function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

router.post('/login', (req, res,next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/links/indexest',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next);
});

module.exports = router