import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routes/index.js";




dotenv.config();
const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"] // <-- allow these custom headers, by default only few simple headers are allwed
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev")); // 'dev' is a predefined logging format


// Db connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DataBase Connected successfully")
    })
    .catch((err) => {
        console.log("Error Conneting DB: ", err.message);
    })


// Routes  
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to Sync APIs" });
})


app.use("/api-v1", router); // all the routes will be prefixed with /api-v1, so if you have a route /auth/login it will be accessible at /api-v1/auth/login


// Express matches middleware in order (top-down).
// not found ep  /osnckj 
app.use((req, res) => {
    return res.status(404).json({ message: "Not Found" })
})

// error middleware, must be last and 4 args, if any err occured at any route this will handle that 
app.use((err, req, res, next) => {
    console.error("Error caught:", err.message);
    res.status(500).send("Internal Server Error");
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

