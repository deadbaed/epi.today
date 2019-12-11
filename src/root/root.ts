import express from "express";
import dateformat from "dateformat";

export const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    return res.render("root", {
        date: dateformat(Date.now(), "dddd, mmmm dS")
    });
};
