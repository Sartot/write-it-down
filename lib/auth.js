import { betterAuth } from "better-auth";
import { Pool } from 'pg';
import { getBaseUrl, isProduction } from './env';
 
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "t+qIKtxeaiCblfcimpm14EXQK1FL8ZhXNR1gpCBanL0=",
    baseURL: getBaseUrl(),
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction() ? {
            rejectUnauthorized: false
        } : false
    }),
    emailAndPassword: {  
        enabled: true
    },
    user:{
        changeEmail: {
            enabled: true,
        },
    },
    trustedOrigins: [getBaseUrl()]
})