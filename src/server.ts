import express from "express";
import morgan from "morgan";
import boom from "@hapi/boom";

const server = express();

server.use(morgan("dev"));
server.use(express.json());


server.get("/uptime", (req: express.Request, res: express.Response) => {
    return res.status(200).json({ uptime: process.uptime() });
});

// 404
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // generate 404 and pass it to error handler
    return next(boom.notFound());
});

// error handler when calling next()
server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(err.output.statusCode).json(err.output.payload);
});

export default server;
