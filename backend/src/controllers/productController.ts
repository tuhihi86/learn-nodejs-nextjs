import { Request, Response } from 'express';
import Product from '../models/Product';
import User from '../models/User';

export const createProduct = async (req: Request, res: Response): Promise<any> => {
    const { name, description, price, category, brand, stock, images } = req.body;
  
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!req.userId) {
      return res.status(401).json({ msg: 'Unauthorized: Please log in' });
    }
  
    try {
      // Lấy thông tin người dùng từ cơ sở dữ liệu
      const user = await User.findById(req.userId);
      
      // Kiểm tra xem người dùng có vai trò admin không
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden: You do not have permission to create products' });
      }
  
      // Kiểm tra các trường bắt buộc
      if (!name || !description || !price || !category || !brand || stock == null) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
      }
  
      // Tạo sản phẩm mới
      const product = new Product({
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
      });
  
      await product.save();
  
      return res.status(201).json({
        msg: 'Product created successfully',
        product,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error' });
    }
  };

export const getAllProduct = async (req: Request, res: Response): Promise<any> =>{
    try {
        const products = await Product.find();
        return res.status(200).json(products);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
      }
}
