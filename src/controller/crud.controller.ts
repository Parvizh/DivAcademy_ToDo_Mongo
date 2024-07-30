import { Document, Model } from "mongoose";
import { Request, Response } from "express"
import { errorHandler } from "../helpers/errorHandler";
import { SORT_TYPE } from "../enums/sort.enum";
import { QueryDto } from "../dto/query.dto";

export class CRUDController<T extends Document> {
    public model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(req: Request, res: Response) {
        try {
            const result = await this.model.create(req.body);
            return res.status(201).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const result = await this.model.findById(req.params.id)
            if (!result) return errorHandler(res, 404, "This data is not found")
            return res.status(200).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async find(req: Request, res: Response) {
        try {
            const { page, limit, sort, order = SORT_TYPE.DESC, searchText } = req.query;

            const orderParser = order == SORT_TYPE.ASC ? 1 : -1;
            const skip = (Number(page) - 1) * Number(limit)

            const whereCondition = {
                $or: [
                    { name: new RegExp(searchText as string, 'i') },
                    { surname: new RegExp(searchText as string, 'i') }]
            }

            const resultPromise = this.model
                .find(whereCondition)
                .sort(sort ? { [sort as string]: orderParser } : {})
                .skip(skip)
                .limit(Number(limit))
                .lean()

            const totalCountPromise = this.model.countDocuments()

            const [result, totalCount] = await Promise.all([resultPromise, totalCountPromise])

            return res.status(200).json({
                result,
                metadata: {
                    limit,
                    page,
                    totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!result) return errorHandler(res, 404, "This data is not found")
            return res.status(200).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await this.model.findByIdAndDelete(req.params.id);
            if (!result) return errorHandler(res, 404, "This data is not found")
            return res.status(201).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }
}

