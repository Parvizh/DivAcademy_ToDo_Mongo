import path from "path";
import fs from "fs"
import multer from "multer";
import { FILE_ERROR } from "../constants/errorMessage";

const filePath = path.join(__dirname, "..", "..", "public")
if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
}

const storage = multer.diskStorage({
    destination(req, file: Express.Multer.File, cb) {
        cb(null, filePath)
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const fileFilter = (req, file: Express.Multer.File, cb) => {
    const mimeTypes: ReadonlyArray<string> = ['image/png', 'image/jpeg', 'image/jpg']

    if (!mimeTypes.includes(file.mimetype)) {
        cb(new Error(FILE_ERROR.NOT_ALLOWED), false)
    }
    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
})

export default upload;
