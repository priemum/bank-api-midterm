const Checking = require('../models/Checking');
const Savings = require('../models/Savings');

//generate random number inclusive of min and max
const randomGen = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//generate random account number
const generateAccountNumber = () => {
    let acctArr = [];
    while(acctArr.length < 9){
        acctArr.push(randomGen(0, 9));
    };
    return acctArr.join('');
};

//check for unique account number
const uniqueAccountNumber = () => {
    let acctNum = generateAccountNumber();
    Checking.findOne({accountNumber: acctNum})
        .then(acct => {
            if(acct){
                uniqueAccountNumber();
            } else {
                Savings.find({acctNum})
                .then(acct => {
                    if(acct){
                        uniqueAccountNumber();
                    } else {
                        return acctNum;
                    }
                })
                .catch(err => reject(err));
            }
        })
        .catch(err => reject(err));
};

const createTransaction = (id) => {
    Checking.findOne({owner:id}).then(acct => 
        acct
    )
    .then((acct) => {
        const newTrans = new CheckingTrans();
        newTrans.owner = acct._id;
        newTrans.description = 'test';
        newTrans.amount = '$10.00';
        newTrans.save()
        .then(trans => {
            req.login(trans, err => {
                if (err) {
                    return res
                    .status(400)
                    .json({ confirmation: false, message: err });
                } else {
                    res.redirect('/auth/options');
                    next();
                }
            });
        })
        .catch(err => {
            return next(err);
        });
    })
    // return ownerID
    // return acct_id;
}

module.exports = {
    randomGen,
    generateAccountNumber,
    uniqueAccountNumber,
    createTransaction
}