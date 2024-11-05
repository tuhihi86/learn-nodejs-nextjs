import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createProduct,getAllProduct } from '../controllers/productController';

const router = express.Router();

router.post('/create',authMiddleware, createProduct);
router.get('/getAll',getAllProduct);

export default router;
