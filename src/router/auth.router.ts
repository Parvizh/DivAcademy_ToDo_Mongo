import { Router } from "express";
import authController from "../controller/mongoose/auth.controller";

const router = Router()

router.post('/signup', (req, res) => {
    const result = authController.signup(req, res)
    return result;
})

export default router;