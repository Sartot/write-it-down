import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
 
export const auth = betterAuth({
    secret: "t+qIKtxeaiCblfcimpm14EXQK1FL8ZhXNR1gpCBanL0=",
    database: createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "write-it-down"
    }),
    emailAndPassword: {  
        enabled: true
    },
    trustedOrigins: ["http://192.168.1.213:3000"]
})