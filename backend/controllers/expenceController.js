import express from 'express';
import User from '../models/User.js';
import Expence from '../models/Expence.js';
import xlsx from 'xlsx';
// Controller functions for Expence management
export async function addExpence(req,res)
{
const userId=req.user._id;
try {
    const {icon,category,amount,date}=req.body;

    if(!category || !amount ||!date)
    {
        return res.status(400).json({message:"Category, Amount and Date are required"});
    }


    const newExpence=new Expence({
        userId,
        icon,
        category,
        amount,
        date:new Date(date)
    })

    const savedExpence=await newExpence.save();
    res.status(201).json(savedExpence);
} catch (error) {
    res.status(500).json({message:"Server Error while adding income",error:error.message});
}
}


// Get all Expence entries for a user
export async function getAllExpence(req,res)
{

const userId=req.user._id;
try {
    const  expence=await Expence.find({userId}).sort({date: -1});

    res.json(expence);
} catch (error) {
    res.status(500).json({message:"Server Error while fetching income",error:error.message});
}

}

// Delete a specific Expence entry by ID
export async function deleteExpence(req,res)
{

try {
    await Expence.findByIdAndDelete(req.params.id);
    res.json({message:"Expence Deleted Sucessfully"})
} catch (error) {
    res.status(500).json({message:"Server Error while deleting Expence",error:error.message});
}
}


// Download income data as an Excel file
export async function dowloadExpenceExcel(req,res)
{
const userId=req.user._id;
try {
    const ExpenceData=await Expence.find({userId}).sort({date:-1})

    //prepare for data to Excel

    const data=ExpenceData.map((item)=>
    ({
        Category:item.category,
        Amount:item.amount,
        Date:item.date.toISOString().split('T')[0], //format date as YYYY-MM-DD

    }));

    //Create a new workbook and add data
    const workbook=xlsx.utils.book_new();
    const worksheet=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook,worksheet,"ExpenceData");
    xlsx.writeFile(workbook,"ExpenceData.xlsx");
    res.download("ExpenceData.xlsx");

} catch (error) {
    res.status(500).json({message:"Server Error while downloading Expence data",error:error.message});
}
}    
