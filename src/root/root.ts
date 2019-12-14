import express from "express";
import dateformat from "dateformat";
import env from "../env";
import { EventType, getEvents } from "../intra/event";

export const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let EventList: Array<EventType> = getEvents(<string>env.AUTOLOGIN, "2020", "01", "15");

    EventList.forEach((event: EventType) => {
        console.log(`${event.semester} ${event.module} ${event.name} ${event.registered}`);
    });

    console.log("rendering page");
    return res.render("pages/root", {
        date: dateformat(Date.now(), "dddd, mmmm dS")
    });
};
