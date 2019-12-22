import * as dotenv from "dotenv";

dotenv.config();

const { MODE, HOST, PORT, AUTOLOGIN, CLIENT_ID, CLIENT_SECRET, TENANT } = process.env;

if (MODE === "undefined" || HOST === "undefined" || PORT === "undefined" || AUTOLOGIN === "undefined" ||
    CLIENT_ID === "undefined" || CLIENT_SECRET === "undefined" || TENANT === "undefined") {
    console.log("make sure you have MODE HOST PORT AUTOLOGIN in your .env file");
    process.exit(1);
}

export default {
    MODE: MODE,
    HOST: HOST,
    PORT: PORT,
    AUTOLOGIN: AUTOLOGIN,
    CLIENT_ID: CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET,
    TENANT: TENANT
};
