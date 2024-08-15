import { Router } from "express";
import { signup } from "../controller/auth.controller";

const router = Router()

router.post('/signup', (req, res) => {
    const result = signup(req, res)
    return result;
})

export default router;