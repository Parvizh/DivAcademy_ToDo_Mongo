import { Request, Response } from "express"
import { errorHandler } from "../../helpers/errorHandler";
import { SORT_TYPE } from "../../enums/sort.enum";
import { BaseEntity } from "../../model/base-entity";
import { FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

export abstract class TOCRUDController<T extends BaseEntity> {
    public repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    async create(req: Request, res: Response) {
        try {
            const data = this.repository.create(req.body);
            const result = await this.repository.save(data)
            return res.status(201).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const result = await this.repository.findOne({ where: { id: req.params.id } as any })
            if (!result) return errorHandler(res, 404, "This data is not found")
            return res.status(200).json({ result })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }



    async find(req: Request, res: Response) {
        try {
            const { page, limit, sort, order = SORT_TYPE.DESC, searchText = '' } = req.query;
            const skip = (Number(page) - 1) * Number(limit)

            const [result, totalCount] = await this.repository.findAndCount({
                where: this.whereConditionFindAll(searchText as string),
                order: sort ? { [sort as string]: order } as FindOptionsOrder<T> : undefined,
                select: this.selectFindAll(),
                take: Number(limit),
                skip,
                relations: this.relationFindAll()
            })

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
            console.log(error)
            return errorHandler(res, 500, error.message)
        }
    }

    // async update(req: Request, res: Response) {
    //     try {
    //         // const result = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    //         let result: T = await this.model.findById(req.params.id)
    //         if (!result) return errorHandler(res, 404, "This data is not found")

    //         await this.beforeUpdate(result, req, res)

    //         if (!res.headersSent) {
    //             result = Object.assign(result, req.body)
    //             const data = await result.save()

    //             return res.status(200).json({ result: data })

    //         }
    //     } catch (error: any) {
    //         return errorHandler(res, 500, error.message)
    //     }
    // }

    // async delete(req: Request, res: Response) {
    //     try {
    //         const result = await this.model.findByIdAndDelete(req.params.id);
    //         if (!result) return errorHandler(res, 404, "This data is not found")
    //         return res.status(201).json({ result })
    //     } catch (error: any) {
    //         return errorHandler(res, 500, error.message)
    //     }
    // }

    relationFindAll() {
        return null
    }

    abstract whereConditionFindAll(searchText: string)
    abstract selectFindAll(): (keyof T)[]
    // abstract beforeUpdate(data: T, req: Request, res: Response): Promise<void>


    // async _findById(id: string): Promise<T | Error> {
    //     try {
    //         const result: T = await this.model.findById(id)
    //         if (!result) return new Error("This data is not found")
    //         return result
    //     } catch (error: any) {
    //         return new Error(error.message)
    //     }
    // }
}