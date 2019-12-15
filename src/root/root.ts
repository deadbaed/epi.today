import express from "express";

export const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.render("pages/root");
};
