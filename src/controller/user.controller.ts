import { Document, FilterQuery, Model } from "mongoose";
import { Request, Response } from "express"
import { errorHandler } from "../helpers/errorHandler";
import { SORT_TYPE } from "../enums/sort.enum";
import { IUser, User } from "../schema/user.schema";


export const create = async (req: Request, res: Response) => {
    try {
        const result = await User.create(req.body);
        return res.status(201).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}


export const findOne = async (req: Request, res: Response) => {
    try {
        const result = await User.findById(req.params.id)
        if (!result) return errorHandler(res, 404, "This data is not found")
        return res.status(200).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}

export const find = async (req: Request, res: Response) => {
    try {
        const { page, limit, sort, order = SORT_TYPE.DESC, searchText = '' } = req.query;

        const orderParser = order == SORT_TYPE.ASC ? 1 : -1;
        const skip = (Number(page) - 1) * Number(limit)

        const whereCondition: FilterQuery<IUser> = {
            $or: [
                { name: new RegExp(searchText as string, 'i') },
                { surname: new RegExp(searchText as string, 'i') }]
        }

        const resultPromise = User
            .find(whereCondition)
            .sort(sort ? { [sort as string]: orderParser } : {})
            .select("name surname")
            .skip(skip)
            .limit(Number(limit))
            .lean()

        const totalCountPromise = User.countDocuments(whereCondition)

        const [result, totalCount] = await Promise.all([resultPromise, totalCountPromise])

        return res.status(200).json({
            result,
            metadata: {
                limit,
                page,
                totalCount,
                totalPages: totalCount < Number(limit) ? totalCount : Math.ceil(totalCount / Number(limit))
            }
        })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        let result = await User.findById(req.params.id)
        if (!result) return errorHandler(res, 404, "This data is not found")

        if (!res.headersSent) {
            result = Object.assign(result, req.body)
            const data = await result.save()

            return res.status(200).json({ result: data })

        }
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) return errorHandler(res, 404, "This data is not found")
        return res.status(201).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}