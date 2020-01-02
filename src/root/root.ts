import express from "express";
import { StudentType, getStudent } from "../intra/student";

export const Home = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    /* if user is not logged in, return root page */
    if (!req.cookies.autologin) {
        return res.render("pages/root");
    }

    let Student: StudentType = await getStudent(req.cookies.autologin);

    /* could not retrieve student information */
    if (!Student) {
        return res.status(500).render("errors/500", {
            technical_error: "Could not retrieve student information"
        });
    }

    return res.render("pages/home", {
        student: Student
    });
};
