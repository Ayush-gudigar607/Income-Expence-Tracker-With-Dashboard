import { Types, isValidObjectId } from 'mongoose';
import Income from '../models/Income.js';
import Expence from '../models/Expence.js';


//Dashboard Data Controller
export async function getDashboardData(req,res)
{
try {
    const userId=req.user._id;
    const userObjectId=new Types.ObjectId(userId);

    // Aggregate total income
    const totalIncome=await Income.aggregate([
        {$match:{userId:userObjectId}},
        {$group:{_id:null,totalAmount:{$sum:"$amount"}}}
    ])

    // console.log("Total Income",{totalIncome,userId:isValidObjectId(userId)});

    const totalExpence=await Expence.aggregate([
        {$match:{userId:userObjectId}},
        {$group:{_id:null,totalAmount:{$sum:"$amount"}}}
    ]);

    // console.log("Total Expence",{totalExpence,userId:isValidObjectId(userId)});

    //Get Income transactions in the last 60 days

    const last60DaysIncomeTransaction=await Income.find({
        userId,date:{$gte:new Date(Date.now()-60*24*60*60*1000)}
    }).sort({date:-1});
    

    //Get Total income for 60days
    const totalIncomeLast60Days=last60DaysIncomeTransaction.reduce((sum,transaction)=>sum+transaction.amount,0)

    //Get Expence transactions in the last 30 days
    const last30DaysExpenceTransaction=await Expence.find({
        userId,date:{$gte:new Date(Date.now()-30*24*60*60*1000)}
    }).sort({date:-1});

    //Get Total Expences for 30 Days
    const totalExpenceLast30Days=last30DaysExpenceTransaction.reduce((sum,transaction)=>sum+transaction.amount,0)

    //Fetch last 5 transaction (income+expence)

   const lastTransaction = [
  ...(await Income.find({ userId }).sort({ date: -1 }).limit(5))
    .map(txn => ({ ...txn.toObject(), type: 'Income' })),
  ...(await Expence.find({ userId }).sort({ date: -1 }).limit(5))
    .map(txn => ({ ...txn.toObject(), type: 'Expense' }))
].sort((a,b)=>b.date-a.date)  // Sort combined transactions by date

res.status(200).json({
    totalIncome:totalIncome[0]?.totalAmount || 0,
    totalExpence:totalExpence[0]?.totalAmount || 0,
    last30DaysExpenses:{
        total:totalExpenceLast30Days,
        transactions:last30DaysExpenceTransaction,
    },
    last60DaysIncome:{
        total:totalIncomeLast60Days,
        transactions:last60DaysIncomeTransaction,
    }
    ,
    recenttransaction:lastTransaction,
    })
} catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
}
}
