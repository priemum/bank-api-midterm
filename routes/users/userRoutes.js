const express = require('express');
const router = express.Router();
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');

// render register page
router.get('/register', (req, res) => {
  res.render('users/register', { errors: req.flash('errors') });
});

//register new user
router.post('/register', userValidation, userController.register);


//render login page
router.get('/login', userController.loginPage);

//login user
router.post('/login', userController.login);

//render login error page
router.get('/loginError', userController.loginError);

//render profile page
router.get('/profile', userController.profilePage);

//update profile
router.put('/updateProfile', (req, res, next) => {
  userController
    .updateProfile(req.body, req.user._id)
    .then(user => {
      return res.redirect('/api/users/profile');
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/api/users/updateProfile');
    });
});

//render update profile page
router.get('/updateProfile', userController.updateProfilePage)

//update password
router.put('/updatePassword', userController.updatePassword);

//logout user
router.get('/logout', userController.logout);

module.exports = router;