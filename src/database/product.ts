import { sequelizeDB, DataTypes } from "./connection";

// Create product
export const Product = sequelizeDB.define("Product", {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
});
