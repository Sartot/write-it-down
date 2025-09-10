import { Pool } from 'pg';
import { isProduction } from './env';

// Create a global connection pool for PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction() ? {
        rejectUnauthorized: false
    } : false
});

export async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export default pool;
