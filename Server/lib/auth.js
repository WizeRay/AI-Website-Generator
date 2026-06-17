import 'dotenv/config';
import { betterAuth } from "better-auth";
import { pool } from '../config/db.js';

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || [];

const auth = betterAuth(
    {
        database: pool,
        emailAndPassword: { 
            enabled: true, 
        },
        trustedOrigins,
        baseURL: process.env.BETTER_AUTH_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        advanced:{
            cookies: {
                session_token:{
                    name: 'auth_session',
                    attributes:{
                        httpOnly:true,
                        secure: process.env.NODE_ENV === "development"?false : true ,
                        sameSite: 'none',
                        path:'/',
                    }
            }}
        }
    }
)

export default auth;