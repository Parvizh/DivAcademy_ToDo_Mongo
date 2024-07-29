import { Request, Response } from "express"
import { IUser, User } from "../schema/user.schema";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JwtPayloadDto } from "../dto/jwtPayload.dto";
import { config } from "../config";
import { errorHandler } from "../helpers/errorHandler";

class AuthContoller {
    //Singleton design pattern

    // public static instance: AuthContoller

    // getInstance() {
    //     if (!AuthContoller.instance) {
    //         return AuthContoller.instance = new AuthContoller()
    //     }
    //     return AuthContoller.instance;
    // }
    
    async signup(req: Request, res: Response) {
        const { name, surname, password, age } = req.body;
        const isUserExist = await User.findOne({ name })
        if (isUserExist) {
            return errorHandler(res, 401, "This user name already exist")
        }
        const user = await User.create({ name, surname, password, age })
        const jwt = this.jwtTokenGenerator(user);
        return res.status(201).json({ user, jwt })
    }

    private jwtTokenGenerator(user: IUser) {
        const payload: JwtPayloadDto = {
            id: user._id as string,
            name: user.name
        }
        const jwtToken = jwt.sign(payload, config.jwt_secret_key)
        return jwtToken
    }

}

export default new AuthContoller;