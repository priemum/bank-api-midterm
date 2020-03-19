const mongoose = require('mongoose');

const SavingsSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    accountNumber:{type:String, unique:true, default:''},
    balance:{type:Number}
});

module.exports = mongoose.model('Savings', SavingsSchema);