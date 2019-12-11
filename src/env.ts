import * as dotenv from "dotenv";

dotenv.config();

const { MODE, HOST, PORT, AUTOLOGIN } = process.env;

if (MODE === "undefined" || HOST === "undefined" || PORT === "undefined" || AUTOLOGIN === "undefined") {
    console.log("make sure you have MODE HOST PORT AUTOLOGIN in your .env file");
    process.exit(1);
}

export default {
    MODE: MODE,
    HOST: HOST,
    PORT: PORT,
    AUTOLOGIN: AUTOLOGIN
};
