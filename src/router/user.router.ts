import { Router } from "express";
import userController from "../controller/user.controller";

const router = Router()

router.post('/', (req, res) => {
    const result = userController.create(req, res)
    return result;
})

router.put('/:id', (req, res) => {
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

router.get('/', (req, res) => {
    const result = userController.find(req, res)
    return result;
})

export default router;