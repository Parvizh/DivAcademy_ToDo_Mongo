import { FilterQuery } from "mongoose";
import { errorHandler } from "../helpers/errorHandler";
import { Category, ICategory } from "../schema/category.schema";
import { CRUDController } from "./crud.controller";
import { Request, Response } from "express";

class CategoryController extends CRUDController<ICategory> {
    constructor() {
        super(Category)
    }


    async uploadImage(req: Request, res: Response) {
        try {

            const id = req.params.id;
            if (!req.file) {
                return errorHandler(res, 400, "No file is found")
            }

            const category: any = await super._findById(id)

            category.image = req.file.filename;
            const result = await category.save()

            return res.status(200).json({ result })
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
        return "title"
    }
}

export default new CategoryController()
