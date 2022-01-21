import { sequelizeDB, DataTypes } from "./connection";

// Create product
export const User = sequelizeDB.define("User", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    DNI: DataTypes.INTEGER,
});
