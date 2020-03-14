const Checking = require('../models/Checking');
const Savings = require('../models/Savings');

module.exports = {
    //generate random number inclusive of min and max
    randomGen: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //generate random account number
    generateAccountNumber: () => {
        let acctArr = [];
        while(acctArr.length < 9){
            acctArr.push(randomGen(0, 9));
        };
        return acctArr.join('');
    },

    //check for unique account number
    uniqueAccountNumber: () => {
        let acctNum = generateAccountNumber();
        console.log(acctNum);
        Checking.findOne({acctNum})
            .then(acct => {
                if(acct){
                    uniqueAccountNumber();
                } else {
                    Savings.find({accountNumber})
                    .then(acct => {
                        if(acct){
                            uniqueAccountNumber();
                        } else {
                            return acctNum;
                        }
                    })
                }
            })
    }
}