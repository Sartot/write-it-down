import { betterAuth } from "better-auth";
import { Pool } from 'pg';
 
export const auth = betterAuth({
    secret: "t+qIKtxeaiCblfcimpm14EXQK1FL8ZhXNR1gpCBanL0=",
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }),
    emailAndPassword: {  
        enabled: true
    },
    user:{
        changeEmail: {
            enabled: true,
        },
    },
    // trustedOrigins: ["http://192.168.1.213:3000"]
})