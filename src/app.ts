import "reflect-metadata"; // Enables support for TypeScript decorators and metadata reflection
import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from "./config";
import { mongoInitialConnection } from "./config/mongo.config";
import router from "./router"
import path from "path";
import { errorHandler } from "./helpers/errorHandler";
import { FILE_ERROR } from "./constants/errorMessage";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router)
app.use('/public', express.static(path.join(__dirname, "..", "public")))

app.use((error: Error, req, res, next) => {
    if (error.message === FILE_ERROR.NOT_ALLOWED) {
        return errorHandler(res, 400, FILE_ERROR.NOT_ALLOWED)
    }
    next()
})

app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

mongoInitialConnection()

const port = config.port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});