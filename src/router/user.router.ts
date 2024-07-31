import { Router } from "express";
import userController from "../controller/user.controller";
import { dtoValidationMiddleware } from "../validations/dto.validation";
import { CreateUserDto } from "../dto/user/user.create.dto";
import { UpdateUserDto } from "../dto/user/user.update.dto";
import { QueryDto } from "../dto/query.dto";
import { REQ_TYPE } from "../enums/req.enum";

const router = Router()

router.post('/', dtoValidationMiddleware(CreateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = userController.create(req, res)
    return result;
})

router.put('/:id', dtoValidationMiddleware(UpdateUserDto, REQ_TYPE.BODY), (req, res) => {
    const result = userController.update(req, res)
    return result;
})

router.delete('/:id', (req, res) => {
    const result = userController.delete(req, res)
    return result;
})

router.get('/:id', (req, res) => {
    const result = userController.findOne(req, res)
    return result;
})

router.get('/', dtoValidationMiddleware(QueryDto, REQ_TYPE.QUERY), (req, res) => {
    const result = userController.find(req, res)
    return result;
})

export default router;