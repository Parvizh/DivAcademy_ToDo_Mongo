import { Category, ICategory } from "../schema/category.schema";
import { CRUDController } from "./crud.controller";

class CategoryController extends CRUDController<ICategory> {
    constructor() {
        super(Category)
    }
}

export default new CategoryController()
