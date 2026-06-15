import"dotenv/config";

import express from "express";
import cors from 'cors';
import { pool } from "./config/db.js";

const app = express();

const PORT = 3000;

const corsOptions = {
    origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials:true,
}

app.use(cors(corsOptions));
const testDB =async () => {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
}

app.get("/",(req,res)=>{
    res.send("Server is live!");
})

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    testDB();
})
