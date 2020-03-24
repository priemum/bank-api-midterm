const express = require('express');
const router = express.Router();
// const passport = require('passport');
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');

// register routes
router.get('/register', (req, res) => {
  res.render('users/register', { errors: req.flash('errors') });
});
router.post('/register', userValidation, userController.register);


//login routes
router.get('/login', userController.loginPage);
router.post('/login', userController.login);

//profile routes
router.get('/profile', userController.profilePage);
// router.get('/profile', (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return res.render('auth/profile');
//   } else {
//     return res.send('Unauthorized');
//   }
// });

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
// router.get('/update-profile', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.render('auth/update-profile');
//   }
//   return res.redirect('/');
// });

//update password
router.put('/updatePassword', userController.updatePassword);
// router.put('/update-password', (req, res) => {
//   userController
//     .updatePassword(req.body, req.user._id)
//     .then(user => {
//       return res.redirect('/api/users/profile');
//     })
//     .catch(err => {
//       console.log('Error in route');
//       return res.redirect('/api/users/update-profile');
//     });
// });

//logout user
router.get('/logout', userController.logout);

module.exports = router;