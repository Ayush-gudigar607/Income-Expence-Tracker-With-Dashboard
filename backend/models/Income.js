import mongoose from "mongoose";

const incomeSchema=new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        icon:{type:String},
        source:{type:String,required:true}, //example:salary,freelance etc...
        amount:{type:Number,required:true},
        date:{type:Date, default:Date.now(),required:true},
    },
    { timestamps: true }
)

const Income = mongoose.model("Income", incomeSchema);

export default Income;
