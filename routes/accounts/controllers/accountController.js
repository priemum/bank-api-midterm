require('../../../lib/passport');
const User = require('../../users/models/User');
const Checking = require('../models/Checking');
const CheckingTrans = require('../models/CheckingTransaction');
const Savings = require('../models/Savings');
const SavingsTrans = require('../models/SavingsTransaction');
const utils = require('../utils/accountUtils')


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
        const id = req.user._id;
        Checking.findOne({owner:id}).then(acct => 
            acct
        )
        .then((acct) => {
            const newTrans = new CheckingTrans();
            newTrans.owner = acct._id;
            newTrans.description = 'test';
            newTrans.amount = '$10.00';
            newTrans.save()
            .then(newTrans, err => {
                    if (err) {
                        return res
                        .status(400)
                        .json({ confirmation: false, message: err });
                    } else {
                        res.redirect('/auth/creditDebit');
                    }
                });
                next();
            })
            .catch(err => {
                next (err);
            });
        
        // console.log(utils.findAccountID(Checking, id));
        // newTrans = new CheckingTrans();
        // newTrans.owner = id;
        // newTrans.description = 'test';
        // newTrans.amount = '$10';
        // newTrans.save()
        // .then(trans => {
        //     res.json(trans);
        // })
        // .catch(err => err);
    }
    // (req, res) => {
    //     console.log(req.user._id);
    //     const id = req.user._id;
    //         Checking.findOne({owner:id}).then(accts => 
    //         res.json(accts._id)
    //         )}
        
        //     console.log(req.user)
        //     res.status(200).json(req.user)
        // }
    
} 