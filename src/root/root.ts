import express from "express";
import env from "../env";
import { StudentType, getStudent } from "../intra/student";

export const Home = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // if not logged in, return root page

    let Student: StudentType = await getStudent(<string>env.AUTOLOGIN);

    if (!Student) {
        // return 500
        return res.status(500).render("errors/500", {
            technical_error: "Intra unavailable"
        });
    }

    return res.render("pages/home", {
        student: Student
    });
};
