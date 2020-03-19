require('../../../lib/passport');
const User = require('../../users/models/User');
const Checking = require('../models/Checking');
const CheckingTrans = require('../models/CheckingTransaction');
const Savings = require('../models/Savings');
const SavingsTrans = require('../models/SavingsTransaction');
const utils = require('../utils/accountUtils')
const dcUtils = require('../../../public/javascripts/debtCred')
const flash = require('connect-flash');


module.exports = {

    //render options results page
    options:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('auth/options');
        }else {
            return res.redirect('/fail');
        };
    },

    //render credit and debit page
    creditDebitPage:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('auth/creditDebit');
        }else {
            return res.redirect('/fail');
        };
    },

    //post transaction to account
    transaction:(req, res, next) => {
        const {dollarAmount, description, debtOrCred, acctChoice, } = req.body;
        if(acctChoice === 'checking'){
            const id = req.user._id;
            Checking.findOne({owner:id})
                .then((acct) => {
                    if(debtOrCred === 'withdrawal'){
                        acct.balance -= Number(dollarAmount);
                    } else if(debtOrCred === 'deposit'){
                        acct.balance += Number(dollarAmount);
                    };
                    acct.save()
                    .then((acct) => {
                    const newTrans = new CheckingTrans();
                    newTrans.owner = acct._id;
                    newTrans.transType = debtOrCred;
                    newTrans.description = description;
                    newTrans.amount = dollarAmount;
                    newTrans.newBalance = acct.balance;
                    newTrans.save()
                    .then(() => {
                        res.redirect('/auth/creditDebit');
                    })
                    .catch(err => {
                        next (err);
                    });
                })
            })
        } else if(acctChoice === 'savings'){
            console.log(acctChoice);
            const id = req.user._id;
            Savings.findOne({owner:id})
                .then((acct) => {
                    if(debtOrCred === 'withdrawal'){
                        acct.balance -= Number(dollarAmount);
                    } else if(debtOrCred === 'deposit'){
                        acct.balance += Number(dollarAmount);
                    };
                    acct.save()
                    .then((acct) => {
                    const newTrans = new SavingsTrans();
                    newTrans.owner = acct._id;
                    newTrans.transType = debtOrCred;
                    newTrans.description = description;
                    newTrans.amount = dollarAmount;
                    newTrans.newBalance = acct.balance;
                    newTrans.save()
                    .then(() => {
                        res.redirect('/auth/creditDebit');
                    })
                    .catch(err => {
                        next (err);
                    });
                })
            })
        }
    },

    //render checking account history
    checking: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                CheckingTrans.find({owner:acct._id})
                .then(transactions => {
                    console.log(transactions);
                    return res.render('auth/checking', {transactions})
                })
                .catch(err => err);
            })
            .catch(err => err);
        } else {
            return res.redirect('/fail');
        };
    },

    //render savings account history
    savings: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Savings.findOne({owner:id})
            .then((acct) => {
                SavingsTrans.find({owner:acct._id})
                .then(transactions => {
                    console.log(transactions);
                    return res.render('auth/savings', {transactions})
                })
                .catch(err => err);
            })
            .catch(err => err);
        } else {
            return res.redirect('/fail');
        };
    }
} 