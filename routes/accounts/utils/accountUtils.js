const Checking = require('../models/Checking');
const CheckingTrans = require('../models/CheckingTransaction');
const Savings = require('../models/Savings');
const SavingsTrans = require('../models/SavingsTransaction');

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
};

const checkMonth = (selectMonth) => {
    switch (selectMonth) {
        case JAN:
          month = "1";
          break;
        case FEB:
          month = "2";
          break;
        case MAR:
           month = "3";
          break;
        case APR:
          month = "4";
          break;
        case MAY:
          month = "5";
          break;
        case JUN:
          month = "6";
          break;
        case JUL:
          month = "7";
          break;
        case AUG:
          month = "8";
          break;
        case SEP:
          month = "9";
          break;
        case OCT:
          month = "10";
          break;
        case NOV:
          month = "11";
          break;
        case DEC:
          month = "12";
          break;
      }
};

const createTransArray = (req, res, params) => {
    const {id, account, month} = params
    transArray = [];
    if(account === 'Checking'){
        Checking.findOne({owner:id})
        .then(acct => {
            const cId = acct._id
            return cId
        })
        .then(cId => {
            CheckingTrans.find({owner:cId})
        })
        .then(transactions => {
            transArray.push(...transactions.filter(date.slice(indexOf('/')) === month))
        })
        .then(transArray => res.send(transArray))
    }
    
}


module.exports = {
    randomGen,
    generateAccountNumber,
    uniqueAccountNumber,
    checkForNumbers,
    checkMonth
}