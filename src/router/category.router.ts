import { Router } from "express";
import categoryController from "../controller/category.controller";
import { dtoValidationMiddleware } from "../validations/dto.validation";
import { QueryDto } from "../dto/query.dto";
import { REQ_TYPE } from "../enums/req.enum";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.post(
    '/',
    authMiddleware,
    dtoValidationMiddleware(CreateCategoryDto, REQ_TYPE.BODY),
    (req, res) => {
        req.body.userId = req.user.id
        const result = categoryController.create(req, res)
        return result;
    })

router.put('/:id', dtoValidationMiddleware(UpdateCategoryDto, REQ_TYPE.BODY), (req, res) => {
    const result = categoryController.update(req, res)
    return result;
})

router.delete('/:id', (req, res) => {
    const result = categoryController.delete(req, res)
    return result;
})

router.get('/:id', (req, res) => {
    const result = categoryController.findById(req, res)
    return result;
})

router.get('/', dtoValidationMiddleware(QueryDto, REQ_TYPE.QUERY), (req, res) => {
    const result = categoryController.find(req, res)
    return result;
})

export default router;