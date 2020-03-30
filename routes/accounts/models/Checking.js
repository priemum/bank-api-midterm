const mongoose = require('mongoose');

const CheckingSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    accountNumber:{type:String, unique:true, default:''},
    balance:{type:Number, default:0}
});

module.exports = mongoose.model('Checking', CheckingSchema);