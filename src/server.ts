import express from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import env from "./env";
require("./authentication");

const server = express();

server.use(cookieParser());

server.use(cookieSession({
    name: "epi.today session",
    maxAge: 31 * (24 * (60 * (60 * 1000))), /* 31 days in milliseconds */
    keys: [<string>env.COOKIE_SESSION]
}));

server.use(passport.initialize()); /* initialize passport */
server.use(passport.session()); /* make login sessions persist */

server.use(express.static("./public"));
server.set("views", "./views");
server.set("view engine", "pug");

if (env.MODE == "prod") {
    server.use(morgan("common"));
} else {
    server.locals.pretty = true; /* don't minify html */
    server.use(morgan("dev"));
}

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

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
