import { Document, FilterQuery, Model } from "mongoose";
import { Request, Response } from "express"
import { errorHandler } from "../helpers/errorHandler";
import { SORT_TYPE } from "../enums/sort.enum";

export abstract class CRUDController<T extends Document> {
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

    async findOne(req: Request, res: Response) {
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
            const { page, limit, sort, order = SORT_TYPE.DESC, searchText = '' } = req.query;

            const orderParser = order == SORT_TYPE.ASC ? 1 : -1;
            const skip = (Number(page) - 1) * Number(limit)


            const resultPromise = this.model
                .find(this.whereConditionFindAll(searchText as string))
                .sort(sort ? { [sort as string]: orderParser } : {})
                .populate(this.populateFindAll())
                .select(this.selectFindAll())
                .skip(skip)
                .limit(Number(limit))
                .lean()

            const totalCountPromise = this.model.countDocuments(this.whereConditionFindAll(searchText as string))

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

    async update(req: Request, res: Response) {
        try {
            // const result = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            let result: T = await this.model.findById(req.params.id)
            if (!result) return errorHandler(res, 404, "This data is not found")

            await this.beforeUpdate(result, req, res)

            if (!res.headersSent) {
                result = Object.assign(result, req.body)
                const data = await result.save()

                return res.status(200).json({ result: data })

            }
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

    populateFindAll() {
        return null
    }

    abstract whereConditionFindAll(searchText: string): FilterQuery<T>
    abstract selectFindAll(): string
    abstract beforeUpdate(data: T, req: Request, res: Response): Promise<void>


    async _findById(id: string): Promise<T | Error> {
        try {
            const result: T = await this.model.findById(id)
            if (!result) return new Error("This data is not found")
            return result
        } catch (error: any) {
            return new Error(error.message)
        }
    }
}