import dotenv from "dotenv"

dotenv.config()

export const config = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
    password_salt: process.env.PASWORD_SALT
}