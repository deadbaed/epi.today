import express from "express";
import morgan from "morgan";

const server = express();

server.set("views", "./views");
server.set("view engine", "pug");

server.use(morgan("dev"));
server.use(express.json());

// import routes
import rootRoutes from "./root/routes";

// use routes
server.use("/", rootRoutes);

server.get("/uptime", (req: express.Request, res: express.Response) => {
    return res.status(200).json({ uptime: process.uptime() });
});

// 404
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404);
    res.render("404");
});

export default server;
