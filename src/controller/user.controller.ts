import { FilterQuery } from "mongoose";
import { IUser, User } from "../schema/user.schema";
import { CRUDController } from "./crud.controller";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

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

    beforeUpdate(data: IUser, req: Request, res: Response) {
        
    }

  
}

export default new UserController()
