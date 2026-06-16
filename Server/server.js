import"dotenv/config";

import express from "express";
import cors from 'cors';
import { pool } from "./config/db.js";
import {toNodeHandler} from 'better-auth/node'
import auth from "./lib/auth.js";

const app = express();

const PORT = 3000;

const corsOptions = {
    origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials:true,
}

app.use(cors(corsOptions));

app.all('/api/auth/{*any}', toNodeHandler(auth));

const testDB =async () => {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
}

// const getusers =async () => {
//     const result = await pool.query(' SELECT * FROM "user" ');
//     console.log(result.rows);
// }

app.get("/",(req,res)=>{
    res.send("Server is live!");
    // getusers();
})

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    testDB();
})
