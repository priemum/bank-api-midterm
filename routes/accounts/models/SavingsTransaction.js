const mongoose = require('mongoose');
const today = () =>{
    return `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`;
};

const SavingsTransactionSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'Savings'},
    date:{default:today()},
    description:{type:String, uppercase:true, default:''},
    amount:{type:String, default:''}
});

module.exports = mongoose.model('SavingsTrans', SavingsTransactionSchema);