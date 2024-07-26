import "reflect-metadata"; // Enables support for TypeScript decorators and metadata reflection
import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from "./config";
import { mongoInitialConnection } from "./config/mongo.config";
import router from "./router"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router)

app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});


mongoInitialConnection()

const port = config.port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});