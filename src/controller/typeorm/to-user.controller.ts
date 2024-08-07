import { Request, Response } from "express";
import { TOCRUDController } from "./to-crud.controller";
import { UserEntity } from "../../model/user.entity";
import { AppDataSource } from "../../config/sql.config";
import { ILike } from "typeorm";

class TOUserController extends TOCRUDController<UserEntity> {
    constructor() {
        super(AppDataSource.getRepository(UserEntity))
    }


    whereConditionFindAll(searchText: string) {
        if (searchText) {
            return [
                {
                    name: ILike(`%${searchText}%`)
                },
                {
                    surname: ILike(`%${searchText}%`)
                }
            ]
        }
        else return null
    }

    selectFindAll(): (keyof UserEntity)[] {
        return ['name', 'surname', 'age']
    }

    // async beforeUpdate(data: IUser, req: Request, res: Response) { }


}

export default new TOUserController()
