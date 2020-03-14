const mongoose = require('mongoose');

const CheckingSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    balance:{type:Number, trim:true, default:0.00},
    accountNumber:{type:String, unique:true, default:''}
});

module.exports = mongoose.model('Checking', CheckingSchema);