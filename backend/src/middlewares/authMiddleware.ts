import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.userId;  
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
