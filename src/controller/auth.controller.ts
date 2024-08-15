import { Request, Response } from "express"
import { IUser, User } from "../schema/user.schema";
import jwt from "jsonwebtoken"
import { JwtPayloadDto } from "../dto/jwtPayload.dto";
import { config } from "../config";
import { errorHandler } from "../helpers/errorHandler";

export const signup = async (req: Request, res: Response) => {
    const { name, surname, password, age } = req.body;
    const isUserExist = await User.findOne({ name })
    if (isUserExist) {
        return errorHandler(res, 401, "This user name already exist")
    }
    const user = await User.create({ name, surname, password, age })
    const jwt = jwtTokenGenerator(user);
    return res.status(201).json({ user, jwt })
}

const jwtTokenGenerator = (user: IUser) => {
    const payload: JwtPayloadDto = {
        id: user.id,
        name: user.name
    }
    const jwtToken = jwt.sign(payload, config.jwt_secret_key)
    return jwtToken
}