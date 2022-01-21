import * as express from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { User, Product, Auth } from "./database/models";
import "./dev";

// Server config
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

// Hash function
function stringToHash(text: string) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

// Auth middleware
async function AuthTokenMiddleware(req, res, next) {
    // Get the request authorization
    const { authorization } = req.headers;

    // Check if the authorization exists
    if (!authorization) {
        res.status(200).json({
            message: "Missing Authorization!",
        });

        return;
    }

    // Get the authorization token
    const authToken = authorization.split(" ")[1];

    // Decrypt the token
    try {
        const userData = jwt.verify(authToken, process.env.TOKEN_SECRET);

        // Assign the user data to the request
        req._user = userData;

        // Go to the next instance
        next();
    } catch {
        res.status(401).json({ error: "Invalid secret token key!" });
    }
}

// Signup
app.post("/auth", async (req, res) => {
    // Get body attributes
    const { username, email, DNI, password } = req.body;

    // Create the user if it is not created
    const [createdUser, createdFlag] = await User.findOrCreate({
        where: { email },
        defaults: { username, email, DNI },
    });

    // If the user was already created, dont do the auth
    if (!createdFlag) {
        res.json({
            createdFlag,
        });

        return;
    }

    // Make the auth
    await Auth.create({
        email,
        password: stringToHash(password),
        UserId: createdUser.getDataValue("id"),
    });

    res.status(200).json({
        message: "User created successfully!",
        createdUser,
    });
});

// Signin
app.post("/auth/token", async (req, res) => {
    // Get the body params
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = stringToHash(password);

    // Query the auth registers
    const authQuery = await Auth.findOne({
        where: { email, password: hashedPassword },
    });

    // If email or password are incorrect, just stop here
    if (!authQuery) {
        res.status(400).json({
            message: "Incorrect Email or Password!",
        });

        return;
    }

    // Generate a web token, and send it to the client
    const webToken = jwt.sign(
        { userId: authQuery.getDataValue("UserId") },
        process.env.TOKEN_SECRET
    );

    res.status(200).json({
        webToken,
    });
});

// Get all users endpoint
app.get("/users", async (req, res) => {
    // All users
    const users = await User.findAll();

    res.status(200).json(users);
});

// Delete all users endpoint
app.delete("/users", async (req, res) => {
    await User.sync({ force: true });

    res.json({
        message: "All users were deleted!",
    });
});

// Create a product, only if authorized
app.post("/products", AuthTokenMiddleware, async (req, res) => {
    // Get the product attributes, and the user data
    const {
        body: { name, price },
        _user: { userId },
    } = req;

    // Create the product
    const createdProduct = await Product.create({
        name,
        price,
        UserId: userId,
    });

    res.status(200).json(createdProduct.get());
});

// Get all the client products, only if authorized
app.get("/me/products", AuthTokenMiddleware, async (req, res) => {
    // Get the user data
    const { userId } = req._user;

    // Get all the products from this user
    const userProducts = await Product.findAll({
        where: { UserId: userId },
    });

    res.status(200).json(userProducts);
});

// Get all products endpoint
app.get("/products", async (req, res) => {
    // All products
    const products = await Product.findAll();

    res.status(200).json(products);
});

// Delete all products endpoint
app.delete("/products", async (req, res) => {
    await Product.sync({ force: true });

    res.json({
        message: "All products were deleted!",
    });
});

// Listen to requests
app.listen(PORT, () => {
    console.log(`>>> App listening to port ${PORT}`);
});
