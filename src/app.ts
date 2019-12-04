import env from "./env";
import server from "./server";

server.listen({ port: env.PORT, host: env.HOST });
console.log(`webserver http://${env.HOST}:${env.PORT}`);
