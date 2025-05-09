import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: ".env",
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,(PORT = process.env.PORT )=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err) =>{
    console.log("MongoDB connection Failed !!!!", err);
    
});