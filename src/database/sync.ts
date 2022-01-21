import { sequelizeDB } from "./connection";
import "./models";

sequelizeDB.sync({ alter: true }).then(() => {
    console.log("\nDatabase synced!\n");
});
