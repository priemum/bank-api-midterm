const mongoose = require('mongoose');

const CheckingSchema = new mongoose.Schema({
    owner:{type:Schema.Types.ObjectId, ref:'User'},
    balance:{type:Number, trim:true, default:0.00},
    accountNumber:{type:Number, unique:true, default:0}
});

module.exports = mongoose.model('Comment', CheckingSchema);