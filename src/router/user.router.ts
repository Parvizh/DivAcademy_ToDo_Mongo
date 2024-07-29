import { Router } from "express";
import userController from "../controller/user.controller";
import { bodyDtoValidationMiddleware, queryDtoValidationMiddleware } from "../validations/dto.validation";
import { CreateUserDto } from "../dto/user/user.create.dto";
import { UpdateUserDto } from "../dto/user/user.update.dto";
import { QueryDto } from "../dto/query.dto";

const router = Router()

router.post('/', bodyDtoValidationMiddleware(CreateUserDto), (req, res) => {
    const result = userController.create(req, res)
    return result;
})

router.put('/:id', bodyDtoValidationMiddleware(UpdateUserDto),(req, res) => {
    const result = userController.update(req, res)
    return result;
})

router.delete('/:id', (req, res) => {
    const result = userController.delete(req, res)
    return result;
})

router.get('/:id', (req, res) => {
    const result = userController.findById(req, res)
    return result;
})

router.get('/',queryDtoValidationMiddleware(QueryDto), (req, res) => {
    const result = userController.find(req, res)
    return result;
})

export default router;