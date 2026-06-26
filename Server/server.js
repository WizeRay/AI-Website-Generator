import "dotenv/config";

import express from "express";
import cors from 'cors';
import { pool } from "./src/config/db.js";
import {toNodeHandler} from 'better-auth/node'
import {auth} from "./src/lib/auth.js";
import cookieParser from "cookie-parser";

import projectRoutes from './src/routes/projects.route.js';
import userRoutes from "./src/routes/user.route.js"
import projectCodeRoutes from './src/routes/projectCode.route.js'

const app = express();

const PORT = 3000;

const corsOptions = {
    origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials:true,
}

app.use(cors(corsOptions));

//--Body Parsers--
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

//--Better Auth Route Handler--
app.all('/api/auth/{*any}', toNodeHandler(auth));



const testDB =async () => {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
}

// const getusers =async () => {
//     const result = await pool.query(' SELECT * FROM "user" ');
//     console.log(result.rows);
// }

//--Application Routes--
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/', projectCodeRoutes);

//--Server start--
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    testDB();
})
