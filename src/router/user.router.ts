import { Router } from "express";
import { dtoValidationMiddleware } from "../validations/dto.validation";
import { CreateUserDto } from "../dto/user/user.create.dto";
import { UpdateUserDto } from "../dto/user/user.update.dto";
import { QueryDto } from "../dto/query.dto";
import { REQ_TYPE } from "../enums/req.enum";
import toUserController from "../controller/typeorm/to-user.controller";

const router = Router()

router.post('/', dtoValidationMiddleware(CreateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = toUserController.create(req, res)
    return result;
})

router.put('/:id', dtoValidationMiddleware(UpdateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = toUserController.update(req, res)
    return result;
})

router.delete('/:id', (req, res) => {
    const result = toUserController.delete(req, res)
    return result;
})

router.get('/:id', (req, res) => {
    const result = toUserController.findOne(req, res)
    return result;
})

router.get('/', dtoValidationMiddleware(QueryDto, REQ_TYPE.QUERY), (req, res) => {
    const result = toUserController.find(req, res)
    return result;
})

export default router;