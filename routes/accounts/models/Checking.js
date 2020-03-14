// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const CheckingSchema = new Schema({
//     owner:{type:Schema.Types.ObjectId, ref:'User'},
//     balance:{type:Number, trim:true, default:0.00},
//     accountNumber:{type:Number, unique:true, default:0}
// });

// module.exports = mongoose.model('Comment', CheckingSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    owner:{type:Schema.Types.ObjectId, ref:'User'},
    comment:{type:String, trim:true}
});

module.exports = mongoose.model('Comment', CommentSchema);