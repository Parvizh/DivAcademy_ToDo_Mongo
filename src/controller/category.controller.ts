import { Category, ICategory } from "../schema/category.schema";
import { Document, FilterQuery, Model } from "mongoose";
import { Request, Response } from "express"
import { errorHandler } from "../helpers/errorHandler";
import { SORT_TYPE } from "../enums/sort.enum";

export const create = async (req: Request, res: Response) => {
    try {
        const result = await Category.create(req.body);
        return res.status(201).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}

export const findOne = async (req: Request, res: Response) => {
    try {
        const result = await Category.findById(req.params.id)
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

        const whereCondition: FilterQuery<ICategory> = {
            title: new RegExp(searchText as string, 'i')
        }

        const resultPromise = Category
            .find(whereCondition)
            .sort(sort ? { [sort as string]: orderParser } : {})
            .populate({
                path: "userId",
                select: "name"
            })
            .skip(skip)
            .limit(Number(limit))
            .lean()

        const totalCountPromise = Category.countDocuments(whereCondition)

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
        let result = await Category.findById(req.params.id)
        if (!result) return errorHandler(res, 404, "This data is not found")

        if (result.userId.toString() !== req.params.id) {
            return errorHandler(res, 403, "This user doesnt have access to modify this category")
        }

        if (!res.headersSent) {
            result = Object.assign(result, req.body)
            const data = await result.save()

            return res.status(200).json({ result: data })

        }
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}