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
    return Number(acctArr.join(''));
};

//check for unique account number
const uniqueAccountNumber = () => {
    let acctNum = generateAccountNumber();
    Checking.find({accountNumber})
        .then(acct => {
            if(acct){
                acct
            }
        })
}