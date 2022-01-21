import { sequelizeDB, DataTypes } from "./connection";

// Define the Auth model
export const Auth = sequelizeDB.define("Auth", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
});
