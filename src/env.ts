import * as dotenv from "dotenv";

dotenv.config();

export default {
    MODE: (process.env.MODE != "prod") ? "dev" : "prod", /* production mode or development mode */
    HOST: process.env.HOST, /* ip address of host */
    PORT: process.env.PORT, /* port where the app will listen on */
    CLIENT_ID: process.env.CLIENT_ID, /* client_id azure active directory application */
    CLIENT_SECRET: process.env.CLIENT_SECRET, /* client_secret azure active directory application */
    TENANT: process.env.TENANT, /* tenant of the azure active directory application */
    COOKIE_SESSION: process.env.COOKIE_SESSION /* string to encrypt iirc the sessions inside a cookie */
};
