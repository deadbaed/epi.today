import express from "express";
import dateformat from "dateformat";
import env from "../env";
import { EventType, getEvents } from "../intra/event";

/**
 * Redirects to calendar page with today's date
 */
export const Today = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date = Date.now();

    const year: string = dateformat(date, "yyyy");
    const month: string = dateformat(date, "mm");
    const day: string = dateformat(date, "dd");

    return res.redirect("/" + year + "/" + month + "/" + day);
};

/**
 * Redirects to calendar page with tomorrow's date
 */
export const Tomorrow = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    /* current date +1 */
    const date = new Date().setDate(new Date().getDate()+1);

    const year: string = dateformat(date, "yyyy");
    const month: string = dateformat(date, "mm");
    const day: string = dateformat(date, "dd");

    return res.redirect("/" + year + "/" + month + "/" + day);
};

/**
 * Renders calendar page with specific date (in format YYYYMMDD)
 */
export const SpecificDate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date: Date = new Date(req.params.year + "-" + req.params.month + "-" + req.params.day);
    // TODO: handle invalid date -> render 400 page bad request with intra url as debug
    // TODO: handle 1 digit months and days and redirect to correct format

    const year: string = dateformat(date, "yyyy");
    const month: string = dateformat(date, "mm");
    const day: string = dateformat(date, "dd");

    let EventList: Array<EventType> = getEvents(<string>env.AUTOLOGIN, year, month, day);

    EventList.forEach((event: EventType) => {
        console.log(`${event.semester} ${event.module} ${event.name} ${event.registered}`);
    });

    console.log("rendering page");
    return res.render("pages/date", {
        date: dateformat(date, "dddd, mmmm dS"),
        events: EventList
    });
};
