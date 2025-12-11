import express from 'express';
import {registerUser,loginUser,getUserInfo, uploadImage, upload} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/getUser',protect,getUserInfo);  
router.post('/upload-image', upload.single('image'), uploadImage);

router.get('/',(req,res)=>{
    res.send("Auth Route is working");
});

export default router;