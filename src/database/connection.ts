import "../dev";
import { Sequelize, DataTypes } from "sequelize";

// Create the sequelize instance
const sequelizeDB = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export { sequelizeDB, DataTypes };
