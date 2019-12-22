import express from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import passport from "passport";
require("./authentication");

const server = express();

server.use(cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000, /* one week in milliseconds */
    keys: ["randomstringhere, import from .env"]
}));

server.use(passport.initialize()); /* initialize passport */
server.use(passport.session()); /* make login sessions persist */

server.use(express.static("./public"));
server.set("views", "./views");
server.set("view engine", "pug");

server.use(morgan("dev"));
server.use(express.json());

// import routes
import rootRoutes from "./root/routes";
import dateRoutes from "./date/routes";
import authRoutes from "./auth/routes";

// use routes
server.use("/", rootRoutes);
server.use("/", dateRoutes);
server.use("/auth", authRoutes);

// if /uptime works server is ok
server.get("/uptime", (req: express.Request, res: express.Response) => {
    return res.status(200).json({ uptime: process.uptime() });
});

// 404
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404);
    res.render("errors/404");
});

export default server;
