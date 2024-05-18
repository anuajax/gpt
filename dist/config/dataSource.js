import { DataSource } from "typeorm";
import { User } from "../models/User";
const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "user",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
export default AppDataSource;
