import pg from "pg";

const { Pool } = pg;
// console.log(process.env.DATABASE_URL)

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.trim(),
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 10,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});