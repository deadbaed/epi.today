import express from "express";
import autologinCheck from "../intra/autologinCheck";
import { StudentType, getStudent } from "../intra/student";
import env from "../env";

/**
 * Check if user is authenticated or not
 */
export const isUserAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user) {
        /* if user is logged in go to next function */
        next();
    } else {
        /* return 403 error with explanation */
        return res.status(403).render("errors/403", {
            technical_error: "You are not logged in"
        });
    }
};

/**
 * Login request
 */
export const Login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let autologin: string = req.body.autologin;
    autologin = autologin.replace("https://intra.epitech.eu/", ""); /* the intra url isn't needed */

    let autologinReturn = await autologinCheck(autologin);
    if (autologinReturn == false) {
        return res.status(500).render("errors/500", {
            technical_error: "Could not verify your autologin link due to intra error."
        });
    }
    // TODO: store autologin in cookie
    return res.redirect("/auth/callback");
};

/**
 * Callback after successful authentication
 */
export const Callback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // TODO: make intra request and send the email address to render
    let Student: StudentType = await getStudent(<string>env.AUTOLOGIN);

    return res.render("auth/callback", {
        student: Student
    });
};

/**
 * Logout of Office 365 account
 */
export const Logout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.render("auth/logout");
};
