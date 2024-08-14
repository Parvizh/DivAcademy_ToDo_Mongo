import { Request, Response } from "express"
import { errorHandler } from "../../helpers/errorHandler";
import { SORT_TYPE } from "../../enums/sort.enum";
import { BaseEntity, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

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

    async update(req: Request, res: Response) {
        try {
         let updatedData : T = await this.repository.findOne({where : {id: +req.params.id} as object})
         if (!updatedData) return errorHandler(res,404,'Not Found')

            
        await this.beforeUpdate(updatedData, req, res)
        if(!res.headersSent) {
        updatedData = Object.assign(updatedData, req.body)
        updatedData = await updatedData.save()
        }
         return res.status(200).json({ result: updatedData })
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    async delete(req: Request, res: Response) {
        try {
            let data: T = await this.repository.findOne({where: {id: +req.params.id} as object})
            if(!data) return errorHandler(res, 404, 'Not Found')
            await data.remove()
            res.status(200).json({message: 'Deleted'})
        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }
    }

    relationFindAll() {
        return null
    }

    abstract whereConditionFindAll(searchText: string)
    abstract selectFindAll(): (keyof T)[]
    abstract beforeUpdate(data: T, req: Request, res: Response): Promise<void>


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