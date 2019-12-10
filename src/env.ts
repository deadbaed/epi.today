import * as dotenv from "dotenv";

dotenv.config();

const { MODE, HOST, PORT } = process.env;

if (MODE === "undefined" || HOST === "undefined" || PORT === "undefined") {
    console.log("make sure you have MODE HOST PORT in your .env file");
    process.exit(1);
}

export default {
    MODE: MODE,
    HOST: HOST,
    PORT: PORT
};
