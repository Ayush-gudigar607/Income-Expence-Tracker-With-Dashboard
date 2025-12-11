import express from 'express';
import User from '../models/User.js';
import Income from '../models/Income.js';
import xlsx from 'xlsx';
// Controller functions for income management
export async function addIncome(req,res)
{
const userId=req.user._id;
try {
    const {icon,source,amount,date}=req.body;

    if(!source || !amount ||!date)
    {
        return res.status(400).json({message:"Source,Amount and Date are required"});
    }


    const newIncome=new Income({
        userId,
        icon,
        source,
        amount,
        date:new Date(date)
    })

    const savedIncome=await newIncome.save();
    res.status(201).json(savedIncome);
} catch (error) {
    res.status(500).json({message:"Server Error while adding income",error:error.message});
}
}


// Get all income entries for a user
export async function getAllIncome(req,res)
{

const userId=req.user._id;
try {
    const  income=await Income.find({userId}).sort({date: -1});

    res.json(income);
} catch (error) {
    res.status(500).json({message:"Server Error while fetching income",error:error.message});
}

}

// Delete a specific income entry by ID
export async function deleteIncome(req,res)
{

try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({message:"income Deleted Sucessfully"})
} catch (error) {
    res.status(500).json({message:"Server Error while deleting income",error:error.message});
}
}


// Download income data as an Excel file
export async function downloadIncomeExcel(req,res)
{
const userId=req.user._id;
try {
    const incomeData=await Income.find({userId}).sort({date:-1})

    //prepare for data to Excel

    const data=incomeData.map((item)=>
    ({
        Source:item.source,
        Amount:item.amount,
        Date:item.date.toISOString().split('T')[0], //format date as YYYY-MM-DD

    }));

    //Create a new workbook and add data
    const workbook=xlsx.utils.book_new();
    const worksheet=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook,worksheet,"IncomeData");
    xlsx.writeFile(workbook,"IncomeData.xlsx");
    res.download("IncomeData.xlsx");

} catch (error) {
    res.status(500).json({message:"Server Error while downloading income data",error:error.message});
}
}    
