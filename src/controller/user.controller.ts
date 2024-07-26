import { IUser, User } from "../schema/user.schema";
import { CRUDController } from "./crud.controller";

class UserController extends CRUDController<IUser> {
    constructor() {
        super(User)
    }
    
}

export default new UserController()
