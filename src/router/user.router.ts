import { Router } from "express";
import { dtoValidationMiddleware } from "../validations/dto.validation";
import { CreateUserDto } from "../dto/user/user.create.dto";
import { UpdateUserDto } from "../dto/user/user.update.dto";
import { QueryDto } from "../dto/query.dto";
import { REQ_TYPE } from "../enums/req.enum";
import toUserController from "../controller/typeorm/to-user.controller";
import { create, find, findOne, remove, update } from "../controller/user.controller";

const router = Router()

router.post('/', dtoValidationMiddleware(CreateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = create(req, res)
    return result;
})

router.put('/:id', dtoValidationMiddleware(UpdateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = update(req, res)
    return result;
})

router.delete('/:id', (req, res) => {
    const result = remove(req, res)
    return result;
})

router.get('/:id', (req, res) => {
    const result = findOne(req, res)
    return result;
})

router.get('/', dtoValidationMiddleware(QueryDto, REQ_TYPE.QUERY), (req, res) => {
    const result = find(req, res)
    return result;
})

export default router;