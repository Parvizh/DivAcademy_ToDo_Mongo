import { Router } from "express";
import authRouter from "./auth.router"
import userRouter from "./user.router"
import categoryRouter from "./category.router"
import noteRouter from "./note.router"

const router = Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/categories', categoryRouter)
router.use('/notes', noteRouter)

export default router;