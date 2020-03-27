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



const alphMonth = (numMonth) => {
  let month = '';
        if(numMonth === '1'){
            month = 'Jan';
        } else if(numMonth === '2'){
            month = 'Feb';
        } else if(numMonth === '3'){
            month = 'Mar';
        } else if(numMonth === '4'){
            month = 'Apr';
        } else if(numMonth === '5'){
            month = 'May';
        } else if(numMonth === '6'){
            month = 'Jun';
        } else if(numMonth === '7'){
            month = 'Jul';
        } else if(numMonth === '8'){
            month = 'Aug';
        } else if(numMonth === '9'){
            month = 'Sep';
        } else if(numMonth === '10'){
            month = 'Oct';
        } else if(numMonth === '11'){
            month = 'Nov';
        } else if(numMonth === '12'){
            month = 'Dec';
        }
        return month;
    };

const checkStatements = (arr, val) => {
    let count = 0
    for(let i = 0; i < arr.length; i++){
        if(arr[i].month === val){
            count++;
        }
    }
    return count > 0 ? true : false;
}

module.exports = {
    randomGen,
    generateAccountNumber,
    uniqueAccountNumber,
    checkForNumbers,
    alphMonth,
    checkStatements
}