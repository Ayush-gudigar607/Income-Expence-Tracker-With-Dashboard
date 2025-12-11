import express from 'express';
import {addExpence,getAllExpence,deleteExpence,dowloadExpenceExcel} from  "../controllers/expenceController.js";
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post('/add',protect,addExpence);
router.get('/get',protect,getAllExpence);
router.delete('/:id',protect,deleteExpence);
router.get('/downloadExcel',protect,dowloadExpenceExcel);

export default router;