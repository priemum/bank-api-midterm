const mongoose = require('mongoose');
const today = () =>{
    return `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`;
};

const CheckingTransactionSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'Checking'},
    date:{type:String, default:today()},
    description:{type:String, uppercase:true, default:''},
    balance:{type:String, default:''}
});

module.exports = mongoose.model('CheckingTrans', CheckingTransactionSchema);