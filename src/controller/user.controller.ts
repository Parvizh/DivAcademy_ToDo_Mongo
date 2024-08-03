import { FilterQuery } from "mongoose";
import { IUser, User } from "../schema/user.schema";
import { CRUDController } from "./crud.controller";
import { Request, Response } from "express";
class UserController extends CRUDController<IUser> {
    constructor() {
        super(User)
    }


    whereConditionFindAll(searchText: string) {

        const whereCondition: FilterQuery<IUser> = {
            $or: [
                { name: new RegExp(searchText as string, 'i') },
                { surname: new RegExp(searchText as string, 'i') }]
        }

        return whereCondition
    }

    selectFindAll() {
        return "name surname"
    }

    async beforeUpdate(data: IUser, req: Request, res: Response) { }


}

export default new UserController()
