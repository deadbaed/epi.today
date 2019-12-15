import express from "express";
import dateformat from "dateformat";
import env from "../env";
import { EventType, getEvents } from "../intra/event";

export const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const year: string = req.params.year;
    const month: string = req.params.month;
    const day: string = req.params.day;

    console.log(req);
    let EventList: Array<EventType> = getEvents(<string>env.AUTOLOGIN, year, month, day);

    EventList.forEach((event: EventType) => {
        console.log(`${event.semester} ${event.module} ${event.name} ${event.registered}`);
    });

    console.log("rendering page");
    return res.render("pages/date", {
        date: dateformat(new Date(year + "-" + month + "-" + day), "dddd, mmmm dS")
    });
};
