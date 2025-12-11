import express from 'express';
import generateToken from '../utils/GenerateToken.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });



export async function registerUser(req,res)
{
const {fullname,email,password,profileImageUrl}=req.body;

if(!fullname || !email || !password)
{
    return  res.status(400).json({message:"All the fields are required"});
}

try {
   const existingUser=await User.findOne({email});

   if(existingUser)
   {
    return res.status(400).json({message:"User with this email already exists"});
   } 

    const user=await User.create({
        fullname,
        email,
        password,
        profileImageUrl
    });

    res.status(201).json({
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        token:generateToken(user._id)
    });
} catch (error) {
    res.status(500).json({message:"Server Error during registration",error:error.message});
}
}

export async function loginUser(req,res)
{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({message:"Email and Password are required"});
    }
    try {
        const user=await User.findOne({email}); 
        if(!user)
        {
            return res.status(400).json({message:"User is not registered"});
        }
        const isPasswordMatch=await user.comparePassword(password);
        if(!isPasswordMatch)
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }
        res.status(200).json({  
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({message:"Server Error during login",error:error.message});
    }

}

export async function getUserInfo(req,res)
{
const userId=req.user._id;
if(!userId)
{
    return res.status(400).json({message:"User ID is required"});
}
try {
    const user=await User.findById(userId).select("-password");
    if(!user)
    {
    return res.status(404).json({message:"User not found"});
    }

    res.status(200).json({message:"User Details",user})
} catch (error) {
    res.status(500).json({message:"Server Error fetching user info",error:error.message});
}
}

export async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

            const imageUrl = `${process.env.url}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}

// Export the upload middleware for use in routes
export { upload };
