import env from "./env";
import server from "./server";
import { getEvents } from "intra/event";

getEvents(<string>env.AUTOLOGIN, "2020", "01", "15");

server.listen({ port: env.PORT, host: env.HOST });
console.log(`webserver http://${env.HOST}:${env.PORT} in ${env.MODE}`);
