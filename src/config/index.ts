import dotenv from "dotenv"

dotenv.config()

export const config = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
    password_salt: process.env.PASWORD_SALT,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    domain_name: process.env.DOMAIN_NAME,
    db_host: process.env.DB_HOST,
    db_port: Number(process.env.DB_PORT),
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
}