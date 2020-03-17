const mongoose = require('mongoose');
const accountUtils = require('../utils/accountUtils');

const CheckingSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    accountNumber:{type:String, unique:true, default:''},
    balance:{type:Number, trim:true, default:0.00}
});

module.exports = mongoose.model('Checking', CheckingSchema);