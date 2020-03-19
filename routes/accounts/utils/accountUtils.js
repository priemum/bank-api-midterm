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

// const checkingTransaction = (id) => {
//     // (req, res, next) => {
//     // const id = req.user._id;
//     Checking.findOne({owner:id}).then(acct => 
//         acct
//     )
//     .then((acct) => {
//         const newTrans = new CheckingTrans();
//         newTrans.owner = acct._id;
//         newTrans.description = 'test';
//         newTrans.amount = '$10.00';
//         newTrans.save()
//         .then(() => {
//             res.redirect('/auth/creditDebit');
//         })
//         .catch(err => {
//             next (err);
//         });
//     }
//     )}

const checkForNumbers = (val) => {
    let f = 0;
    let dot = 0;
    for (const i of val){
        if(isNaN(Number(i)) && i !== '.'){
            f++;
        }
        if(i === '.'){
            dot++
        }
    }
    return dot > 1 || f > 0;
}


module.exports = {
    randomGen,
    generateAccountNumber,
    uniqueAccountNumber,
    checkForNumbers
}