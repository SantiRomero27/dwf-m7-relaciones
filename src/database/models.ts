import { User } from "./user";
import { Product } from "./product";
import { Auth } from "./auth";

// Relations
User.hasMany(Product);
Product.belongsTo(User);

User.hasOne(Auth);
Auth.belongsTo(User);

export { User, Product, Auth };
