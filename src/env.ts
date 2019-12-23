import * as dotenv from "dotenv";

dotenv.config();

const { MODE, HOST, PORT, AUTOLOGIN, CLIENT_ID, CLIENT_SECRET, TENANT, COOKIE_SESSION } = process.env;

if (MODE === "undefined" || HOST === "undefined" || PORT === "undefined" || AUTOLOGIN === "undefined" ||
    CLIENT_ID === "undefined" || CLIENT_SECRET === "undefined" || TENANT === "undefined" || COOKIE_SESSION === "undefined") {
    console.log("make sure you have a valid .env file");
    process.exit(1);
}

export default {
    MODE: MODE,
    HOST: HOST,
    PORT: PORT,
    AUTOLOGIN: AUTOLOGIN,
    CLIENT_ID: CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET,
    TENANT: TENANT,
    COOKIE_SESSION: COOKIE_SESSION
};
