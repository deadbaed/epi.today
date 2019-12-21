import express from "express";

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
 * Login use with Office 365
 */
export const Office365 = (req: express.Request, res: express.Response, next: express.NextFunction) => {
};

/**
 * Callback after successful authentication
 */
export const Callback = (req: express.Request, res: express.Response, next: express.NextFunction) => {
};

/**
 * Logout of Office 365 account
 */
export const Logout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
};
