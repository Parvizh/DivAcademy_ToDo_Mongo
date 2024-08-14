import { Router } from "express";
import noteController from "../controller/mongoose/note.controller";

const router = Router()

router.get('/group', (req, res) => {
    const result = noteController.findAllGroupByCategory(req, res)
    return result;
})

export default router;