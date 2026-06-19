import 'dotenv/config';
import { betterAuth } from "better-auth";
import { pool } from '../config/db.js';

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || [];

export const auth = betterAuth(
    {
        database: pool,
        emailAndPassword: { 
            enabled: true, 
        },
        trustedOrigins,
        baseURL: process.env.BETTER_AUTH_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        
         user: {
            additionalFields: {
                totalCreation: {
                    type: "number",
                    required: false,
                    defaultValue: 0,
                    fieldName: "totalCreation", // ← maps to your actual snake_case column
                },
                credits: {
                    type: "number",
                    required: false,
                    defaultValue: 20,
                    fieldName: "credits", // matches already, no remapping needed
                },
            },
        },
        
        
        
        advanced:{
             crossSubDomainCookies: {
                enabled: false,
            },
            cookies: {
                session_token:{
                    name: 'auth_session',
                    attributes:{
                        httpOnly:true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                        path:'/',
                    }
            }}
        }
    }
)

