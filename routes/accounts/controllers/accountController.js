require('../../../lib/passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('../../users/models/User');
const Checking = require('../models/Checking');
const CheckingTrans = require('../models/CheckingTransaction');
const CheckingStatement = require('../models/CheckingStatement');
const Savings = require('../models/Savings');
const SavingsTrans = require('../models/SavingsTransaction');
const SavingsStatement = require('../models/SavingsStatement');
const utils = require('../utils/accountUtils');
const dcUtils = require('../../../public/javascripts/debtCred');
const flash = require('connect-flash');


module.exports = {

    //render options page
    options: (req, res) => {
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
    creditDebitPage: (req, res) => {
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
    transaction: (req, res, next) => {
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
                        return res.redirect('/auth/creditDebit');
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
                        return res.redirect('/auth/creditDebit');
                    })
                    .catch(err => {
                        next (err);
                    });
                })
            })
        }
    },
    
    transfer: (req, res, next) => {
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
                                return res.redirect('/auth/transfer');
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
                            return res.redirect('/auth/transfer');
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
    sendMoney: (req, res, next) => {
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
                                acct.balance += Number(dollarAmount);
                                acct.save()
                                .then((acct) => {
                                const newTrans = new CheckingTrans();
                                newTrans.owner = acct._id;
                                newTrans.transType = 'deposit';
                                newTrans.description = `money received from ${req.user.email}`;
                                newTrans.amount = dollarAmount;
                                newTrans.newBalance = acct.balance;
                                newTrans.save();
                                })
                            })
                        })
                        .then(() => {
                            return res.redirect('/auth/sendMoney')
                        })
                        .catch(err => {
                            next (err);
                        });
                    } 
                })
        } else if(sendFrom === 'savings'){
            const id = req.user._id;
            Savings.findOne({owner:id})
                .then((acct) => {
                    if(sendTo){
                        acct.balance -= Number(dollarAmount);
                        acct.save()
                        .then((acct) => {
                        const newTrans = new SavingsTrans();
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
                                acct.balance += Number(dollarAmount);
                                acct.save()
                                .then((acct) => {
                                const newTrans = new CheckingTrans();
                                newTrans.owner = acct._id;
                                newTrans.transType = 'deposit';
                                newTrans.description = `money received from ${req.user.email}`;
                                newTrans.amount = dollarAmount;
                                newTrans.newBalance = acct.balance;
                                newTrans.save();
                                })
                            })
                        })
                        .then(() => {
                            return res.redirect('/auth/sendMoney')
                        })
                        .catch(err => {
                            next (err);
                        });
                    }
                })
        }
    },

    //render statements page
    statementsPage: (req, res) => {
        if(req.isAuthenticated()){
            const id = req.user._id;
            Checking.findOne({owner:id})
            .then((acct) => {
                // const cBalance = acct.balance;
                return acct
                .then(Savings.findOne({owner:id})
                    .then(sAcct =>{
                        // const sBalance = sAcct.balance;
                        return res.render('auth/statements', {cBalance:acct.balance, sBalance:sAcct.balance, cAccount:acct, sAccount:sAcct})
                    })
                )
            })
            .catch(err => err);
        }else {
            return res.redirect('/fail');
        };
    },

    //post new statement
    createStatement: (req, res) => {
        let cBalance = 0;
        let sBalance = 0;
        const id = req.user._id;
        let cAccount = {};
        let sAccount = {};
        const {selectMonth, account} = req.body;
        Checking.findOne({owner:id})
        .then((acct) => {
            cAccount = acct;
            cBalance = acct.balance;
        })
        Savings.findOne({owner:id})
            .then(sAcct =>{
                sAccount = sAcct;
                sBalance = sAcct.balance;
        })
        .then(acct => {
            if(account === 'checking'){
                CheckingTrans.find({owner:cAccount._id})
                .then(transactions => {
                    const transArray = [];
                    transactions.forEach(trans => {
                        const tDate = trans.date
                        if(selectMonth.length === 2){
                            if(tDate.slice(0,2) === selectMonth){
                                transArray.push(trans);
                            };
                        };
                        if(selectMonth.length === 1){
                            if(tDate.slice(0,1) === selectMonth){
                                transArray.push(trans);
                            };
                        }
                    });
                    return transArray;
                })
                .then(transArray => {
                    if(cAccount.statements.length < 12 && !utils.checkStatements(cAccount.statements, utils.alphMonth(selectMonth))){
                    const newStatement = new CheckingStatement();
                    newStatement.owner = cAccount._id;
                    newStatement.month = utils.alphMonth(selectMonth);
                    newStatement.transactions = [...transArray];
                    newStatement.save()
                    .then(statement => {
                        Checking.findOne({_id:cAccount._id})
                        .then(acct => {
                            acct.statements = [...acct.statements, {month:statement.month, type:'checking'}];
                            acct.save()
                        })
                    })
                    }
                })
                return res.redirect('/auth/statements');
            } else if(account === 'savings'){
                SavingsTrans.find({owner:sAccount._id})
                .then(transactions => {
                    const transArray = [];
                    transactions.forEach(trans => {
                        const tDate = trans.date
                        if(selectMonth.length === 2){
                            if(tDate.slice(0,2) === selectMonth){
                                transArray.push(trans);
                            };
                        };
                        if(selectMonth.length === 1){
                            if(tDate.slice(0,1) === selectMonth){
                                transArray.push(trans);
                            };
                        }
                    });
                    return transArray;
                })
                .then(transArray => {
                    console.log(!utils.checkStatements(sAccount.statements, utils.alphMonth(selectMonth)))
                    if(sAccount.statements.length < 12 && !utils.checkStatements(sAccount.statements, utils.alphMonth(selectMonth))){
                    const newStatement = new CheckingStatement();
                    newStatement.owner = sAccount._id;
                    newStatement.month = utils.alphMonth(selectMonth);
                    newStatement.transactions = [...transArray];
                    newStatement.save()
                    .then(statement => {
                        Savings.findOne({_id:sAccount._id})
                        .then(acct => {
                            acct.statements = [...acct.statements, {month:statement.month, type:'savings'}];
                            acct.save()
                        })
                    })
                    }
                })
                return res.redirect('/auth/statements');
            }
        })
    },
    
    monthlyStatements: (req, res) => {
        let cAccount = {};
        let sAccount = {};
        const {account, month} = req.params;
        if(account === 'checking'){
        Checking.findOne({owner:req.user._id})
        .then((acct) => {
            cAccount = acct
            CheckingStatement.find({owner:acct._id})
        .then(statements => {
            const statement = [];
            for(const item of statements){
                if(item.month === month)
                    statement.push(item);
            }
            const transactions = statement[0].transactions
            return res.render('auth/monthlyStatement', {transactions, cAccount, user:req.user})
            // cBalance = acct.balance;
        })
        // Savings.findOne({owner:req.user._id})
        //     .then(sAcct =>{
        //         sAccount = sAcct;
        //         // sBalance = sAcct.balance;
        // })
        

            
        })
    }
    },

    deleteStatement: (req, res) => {
        const {account, month} = req.params
        Checking.findOne({_id:"5e7fc672cd23fb8be6c84412"})
        // .then(acct => {
        
        //     CheckingStatement.find({owner:acct._id})
                // .then(statements => {
                //     const filteredStatements = statements.filter(item => item.month === month);
                //     const statement = filteredStatements[0];
                //     CheckingStatement.findByIdAndDelete({_id:statement._id})
                    // Checking.find({owner:id})
                    .then(acct => {
                        console.log(acct)
                        acct.statements = [];
                        acct.save()
                    // })
                    .then(statement => {
                    res.redirect('/auth/statements');
                })
        })
            
        
    }
    
} 