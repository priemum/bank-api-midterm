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

    //render options page
    options:(req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                const cBalance = acct.balance;
                return cBalance
                .then(Savings.findOne({owner:id})
                    .then(sAcct =>{
                        const sBalance = sAcct.balance;
                        return res.render('auth/options', {cBalance, sBalance})
                    })
                )
            })
            .catch(err => err);
        }else {
            return res.redirect('/fail');
        };
    },

    //render credit and debit page
    creditDebitPage:(req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                const cBalance = acct.balance;
                return cBalance
                .then(Savings.findOne({owner:id})
                    .then(sAcct =>{
                        const sBalance = sAcct.balance;
                        return res.render('auth/creditDebit', {cBalance, sBalance})
                    })
                )
            })
            .catch(err => err);
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
    
    transfer:(req, res, next) => {
        const {transAmount, transFrom, transTo} = req.body;
        if(transFrom === 'checking'){
            const id = req.user._id;
            Checking.findOne({owner:id})
                .then((acct) => {
                    if(transTo === 'savings'){
                        acct.balance -= Number(transAmount);
                        Savings.findOne({owner:acct.owner})
                        .then(sAcct => {
                            sAcct.balance += Number(transAmount);
                            sAcct.save()
                            .then((acct) => {
                                const newTrans = new SavingsTrans();
                                newTrans.owner = acct._id;
                                newTrans.transType = 'deposit';
                                newTrans.description = 'transfer from checking';
                                newTrans.amount = transAmount;
                                newTrans.newBalance = acct.balance;
                                newTrans.save()
                            });
                        })
                        acct.save()
                        .then((acct) => {
                            const newTrans = new CheckingTrans();
                            newTrans.owner = acct._id;
                            newTrans.transType = 'withdrawal';
                            newTrans.description = 'transfer to savings';
                            newTrans.amount = transAmount;
                            newTrans.newBalance = acct.balance;
                            newTrans.save()
                            .then(() => {
                                res.redirect('/auth/transfer');
                            })
                            .catch(err => {
                                next (err);
                            });
                        })
                    } else if(transTo === 'checking'){
                        return res.redirect('/auth/transfer');
                    };
                    
                })
        } else if(transFrom === 'savings'){
            const id = req.user._id;
            Savings.findOne({owner:id})
            .then((acct) => {
                if(transTo === 'checking'){
                    acct.balance -= Number(transAmount);
                    Checking.findOne({owner:acct.owner})
                        .then(cAcct => {
                            cAcct.balance += Number(transAmount);
                            cAcct.save()
                            .then((acct) => {
                                const newTrans = new CheckingTrans();
                                newTrans.owner = acct._id;
                                newTrans.transType = 'deposit';
                                newTrans.description = 'transfer from savings';
                                newTrans.amount = transAmount;
                                newTrans.newBalance = acct.balance;
                                newTrans.save()
                            })
                        });
                    acct.save()
                    .then((acct) => {
                        const newTrans = new SavingsTrans();
                        newTrans.owner = acct._id;
                        newTrans.transType = 'withdrawal';
                        newTrans.description = 'transfer to checking';
                        newTrans.amount = transAmount;
                        newTrans.newBalance = acct.balance;
                        newTrans.save()
                        .then(() => {
                            res.redirect('/auth/transfer');
                        })
                        .catch(err => {
                            next (err);
                        });
                    })
                } else if(transTo === 'savings'){
                    return res.redirect('/auth/transfer');
                };
                
            })
        }
    },

    //render checking account history
    checking: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                const cBalance = acct.balance;
                CheckingTrans.find({owner:acct._id})
                .then(transactions => {
                    const cTransactions = transactions;
                    return (cTransactions)})
                .then(cTransactions =>
                    Savings.findOne({owner:id})
                    .then(sAcct =>{
                        const sBalance = sAcct.balance;
                        return res.render('auth/checking', {cTransactions, cBalance, sBalance})
                    })
                )
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
                const sBalance = acct.balance;
                SavingsTrans.find({owner:acct._id})
                .then(transactions => {
                    const sTransactions = transactions;
                    return (sTransactions)})
                .then(sTransactions =>
                    Checking.findOne({owner:id})
                    .then(cAcct =>{
                        const cBalance = cAcct.balance;
                        return res.render('auth/savings', {sTransactions, cBalance, sBalance})
                    })
                )
            })
            .catch(err => err);
        } else {
            return res.redirect('/fail');
        };
    },

    //render transfer page
    transferPage: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                const cBalance = acct.balance;
                return cBalance
                .then(Savings.findOne({owner:id})
                    .then(sAcct =>{
                        const sBalance = sAcct.balance;
                        return res.render('auth/transfer', {cBalance, sBalance})
                    })
                )
            })
            .catch(err => err);
        }else {
            return res.redirect('/fail');
        };
    },

    //render send money page
    sendMoneyPage: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                const cBalance = acct.balance;
                return cBalance
                .then(Savings.findOne({owner:id})
                    .then(sAcct =>{
                        const sBalance = sAcct.balance;
                        return res.render('auth/sendMoney', {cBalance, sBalance})
                    })
                )
            })
            .catch(err => err);
        }else {
            return res.redirect('/fail');
        };
    },

    //post transaction to account
    sendMoney:(req, res, next) => {
        const {dollarAmount, sendTo, sendFrom, } = req.body;
        if(sendFrom === 'checking'){
            const id = req.user._id;
            Checking.findOne({owner:id})
                .then((acct) => {
                    if(sendTo){
                        acct.balance -= Number(dollarAmount);
                        acct.save()
                        .then((acct) => {
                        const newTrans = new CheckingTrans();
                        newTrans.owner = acct._id;
                        newTrans.transType = 'withdrawal';
                        newTrans.description = `money sent to ${sendTo}`;
                        newTrans.amount = dollarAmount;
                        newTrans.newBalance = acct.balance;
                        newTrans.save()
                        });
                        User.findOne({email:sendTo})
                        .then(user => {
                            return user._id;
                        })
                        .then(idTo => {
                            Checking.findOne({owner:idTo})
                            .then(acct => {
                                acct.balance += dollarAmount;
                                acct.save()
                                .then((acct) => {
                                const newTrans = new CheckingTrans();
                                newTrans.owner = acct._id;
                                newTrans.transType = 'deposit';
                                newTrans.description = `money received from ${req.user.name}`;
                                newTrans.amount = dollarAmount;
                                newTrans.newBalance = acct.balance;
                                newTrans.save();
                                })
                            })
                        })
                        .then(() => {
                            res.redirect('/auth/creditDebit')
                        .catch(err => {
                            next (err);
                        });
                    })
                }
            })
        } else if(acctChoice === 'savings'){
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
    }
    
} 