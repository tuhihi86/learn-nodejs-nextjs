import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * path:
 *   /api/auth/register:
 *     post:
 *       summary: Đăng ký người dùng mới
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 password:
 *                   type: string
 *                   example: "password123"
 *       responses:
 *         201:
 *           description: Người dùng đã được đăng ký thành công
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                     example: "User registered successfully"
 *         400:
 *           description: Email đã tồn tại
 *         500:
 *           description: Lỗi máy chủ
 */

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

/**
 * @swagger
 * path:
 *   /api/auth/login:
 *     post:
 *       summary: Đăng nhập người dùng
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 password:
 *                   type: string
 *                   example: "password123"
 *       responses:
 *         200:
 *           description: Đăng nhập thành công và trả về token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: "your.jwt.token"
 *         400:
 *           description: Thông tin đăng nhập không hợp lệ
 *         500:
 *           description: Lỗi máy chủ
 */

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * @swagger
 * path:
 *   /api/auth/profile:
 *     get:
 *       summary: Lấy thông tin hồ sơ người dùng
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Trả về thông tin người dùng
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "603d214f1c4f1f001f6f3f2a"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *         404:
 *           description: Người dùng không tìm thấy
 *         500:
 *           description: Lỗi máy chủ
 */

export const getUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
