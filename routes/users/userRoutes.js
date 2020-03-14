const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');

// register routes
router.get('/register', (req, res) => {
  res.render('auth/register', { errors: req.flash('errors') });
});
router.post('/register', userValidation, userController.register);

router.get('/login', (req, res) => {
  return res.render('auth/login', { errors: req.flash('errors') });
});

//login routes
router.post('/login', userController.login);

//profile routes
router.get('/profile', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.render('auth/profile');
  } else {
    return res.send('Unauthorized');
  }
});

router.put('/update-profile', (req, res, next) => {
  userController
    .updateProfile(req.body, req.user._id)
    .then(user => {
      return res.redirect('/api/users/profile');
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/api/users/update-profile');
    });
});

router.get('/update-profile', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('auth/update-profile');
  }
  return res.redirect('/');
});

//update password
router.put('/update-password', (req, res) => {
  userController
    .updatePassword(req.body, req.user._id)
    .then(user => {
      return res.redirect('/api/users/profile');
    })
    .catch(err => {
      console.log('Error in route');
      return res.redirect('/api/users/update-profile');
    });
});

module.exports = router;