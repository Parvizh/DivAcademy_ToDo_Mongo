import { FilterQuery } from "mongoose";
import { errorHandler } from "../helpers/errorHandler";
import { Category, ICategory } from "../schema/category.schema";
import { CRUDController } from "./crud.controller";
import { Request, Response } from "express";

class CategoryController extends CRUDController<ICategory> {
    constructor() {
        super(Category)
    }

    isError(data: ICategory | Error): data is Error {
        return (data as Error).message !== undefined
    }

    async uploadImage(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!req.file) {
                return errorHandler(res, 400, "No file is found")
            }

            let result = await super._findById(id)
            if (this.isError(result)) {
                return errorHandler(res, 403, result.message)
            }
            else {
                result.image = req.file.filename;
                const category = await result.save()
                return res.status(200).json({ category })
            }

        } catch (error: any) {
            return errorHandler(res, 500, error.message)
        }

    }

    whereConditionFindAll(searchText: string) {

        const whereCondition: FilterQuery<ICategory> = {
            title: new RegExp(searchText as string, 'i')
        }

        return whereCondition
    }

    selectFindAll() {
        return null
    }

    populateFindAll() {
        return {
            path: "userId",
            select: "name"
        }
    }

    async beforeUpdate(data: ICategory, req: Request, res: Response) {
        if (data.userId.toString() !== "66a8b41a6973f9a9c57d1c47") {
            return errorHandler(res, 403, "This user doesnt have access to modify this category")
        }
    }
}


export default new CategoryController()
