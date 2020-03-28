const express = require('express');
const router = express.Router();
// const passport = require('passport');
require('../../lib/passport');

const accountController = require('./controllers/accountController');
// const userValidation = require('./utils/userValidation');

//render options page
router.get('/options', accountController.options);

//render debit and credit page
router.get('/creditDebit', accountController.creditDebitPage);

//post transaction to account
router.post('/creditDebit', accountController.transaction);

//render checking history page
router.get('/checking', accountController.checking);

//render savings history page
router.get('/savings', accountController.savings);

//render transfer page
router.get('/transfer', accountController.transferPage);

//post transfer to accounts
router.post('/transfer', accountController.transfer);

//post transfer to accounts
router.get('/sendMoney', accountController.sendMoneyPage);

//post transfer to accounts
router.post('/sendMoney', accountController.sendMoney);

//render statements page
router.get('/statements', accountController.statementsPage);

//post new statement
router.post('/statements', accountController.createStatement);

//test pdf
router.get('/monthlyStatements/:account/:month', accountController.monthlyStatements);


module.exports = router;