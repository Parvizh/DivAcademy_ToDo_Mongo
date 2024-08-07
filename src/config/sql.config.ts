import { DataSource } from "typeorm";
import { config } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.db_host,
    port: config.db_port,
    username: config.db_username,
    password: config.db_password,
    database: config.db_name,
    logging: true,
    synchronize: false,
    migrations: ['src/migrations/*{.js,.ts}'],
    entities: ['src/**/*.entity{.js,.ts}']
})