import env from "./env";
import server from "./server";

server.listen({ port: env.PORT, host: "localhost" });
console.log(`webserver http://localhost:${env.PORT} in ${env.MODE}`);
