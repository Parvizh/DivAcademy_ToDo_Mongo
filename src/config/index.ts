import dotenv from "dotenv"

dotenv.config()

export const config = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
    password_salt: process.env.PASWORD_SALT,
    jwt_secret_key: process.env.JWT_SECRET_KEY
}