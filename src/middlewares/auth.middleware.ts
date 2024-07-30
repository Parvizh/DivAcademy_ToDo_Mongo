import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../helpers/errorHandler";
import jwt from 'jsonwebtoken'
import { config } from "../config";
import { User } from "../schema/user.schema";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.header('Authorization')?.replace('Bearer', '').trim()
    if (!token) return errorHandler(res, 401, 'Unauthorized');
    const decoded = jwt.verify(token, config.jwt_secret_key);

    if (typeof decoded === 'string') return errorHandler(res, 401, 'Invalid token')

    const user = await User.findById(decoded.id)
    if (!user) return errorHandler(res, 401, 'User not found');

    req.user = {
        id: user.id,
        name: user.name
    }

    next()
}