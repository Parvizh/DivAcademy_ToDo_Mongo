import { Router } from "express";
import authRouter from "./auth.router"
import userRouter from "./user.router"
import categoryRouter from "./category.router"

const router = Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/categories', categoryRouter)

export default router;