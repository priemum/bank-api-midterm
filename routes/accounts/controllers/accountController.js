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
            Checking.findOne({owner:id}).then(acct => 
                acct)
                .then((acct) => {
                    if(debtOrCred === 'withdrawal'){
                        acct.balance = Number(acct.balance) - Number(dollarAmount);
                    } else if(debtOrCred === 'deposit'){
                        acct.balance = Number(acct.balance) + Number(dollarAmount);
                    };
                    const newTrans = new CheckingTrans();
                    newTrans.owner = acct._id;
                    newTrans.description = description;
                    newTrans.amount = dollarAmount;
                    newTrans.save()
                    .then(() => {
                        res.redirect('/auth/creditDebit');
                    })
                    .catch(err => {
                        next (err);
                    });
                })
        } else if(acctChoice === 'savings'){
            const id = req.user._id;
            Savings.findOne({owner:id}).then(acct => 
                acct)
                .then((acct) => {
                    if(debtOrCred === 'withdrawal'){
                        acct.balance = String(Number(acct.balance) - Number(dollarAmount));
                    } else if(debtOrCred === 'deposit'){
                        acct.balance = String(Number(acct.balance) + Number(dollarAmount));
                    };
                    const newTrans = new CheckingTrans();
                    newTrans.owner = acct._id;
                    newTrans.description = description;
                    newTrans.amount = dollarAmount;
                    newTrans.save()
                    .then(() => {
                        res.redirect('/auth/creditDebit');
                    })
                    .catch(err => {
                        next (err);
                    });
                })
        }
    }
} 