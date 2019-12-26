import * as dotenv from "dotenv";

dotenv.config();

export default {
    MODE: (process.env.MODE != "prod") ? "dev" : "prod",
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    AUTOLOGIN: process.env.AUTOLOGIN,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    TENANT: process.env.TENANT,
    COOKIE_SESSION: process.env.COOKIE_SESSION
};
