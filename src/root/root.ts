import express from "express";
import env from "../env";
import { StudentType, getStudent } from "../intra/student";

export const Home = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // TODO: if not logged in, return root page

    // let Student: StudentType = await getStudent(<string>env.AUTOLOGIN);

    // /* could not retrieve student information */
    // if (!Student) {
    //     return res.status(500).render("errors/500", {
    //         technical_error: "Could not retrieve student information"
    //     });
    // }

    // return res.render("pages/home", {
    //     student: Student
    // });
    return res.render("pages/root");
};
