import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    amount : {
        type:Number,
        required:true
    },
    type : {
        type:String,
        enum:['income','expense'],
        required:true
    },
    category: {
  type: String,
  enum: ['Food', 'Salary', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Others'],
  default: 'Others'
},
    description : {
        type:String,
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const Transaction = mongoose.model('Transaction',TransactionSchema);

export default Transaction;