import { Response } from "express"

export const errorHandler = (res: Response, statusCode: number, message: string) => {
    if (!res.headersSent) {
        res.status(statusCode).json({ message })
    }
}
