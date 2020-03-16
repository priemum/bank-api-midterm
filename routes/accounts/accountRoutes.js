const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../lib/passport');

const accountController = require('./controllers/accountController');
// const userValidation = require('./utils/userValidation');

//render options page
router.get('/options', accountController.options);

module.exports = router;