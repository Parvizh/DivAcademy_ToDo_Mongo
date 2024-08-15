import { Router } from "express";
import { create,findAllGroupByCategory } from "../controller/note.controller";

const router = Router()

router.get('/group', (req, res) => {
    const result = findAllGroupByCategory(req, res)
    return result;
})

router.post('/', (req, res) => {
    const result = create(req, res)
    return result;
})

export default router;