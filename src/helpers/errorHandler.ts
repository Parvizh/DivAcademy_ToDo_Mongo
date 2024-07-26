import { Response } from "express"

export const errorHandler = (res: Response, statusCode: number, message: string) => {
    res.status(statusCode).json({ message })
}
