import express from "express";
import moment from "moment";
import env from "../env";
import { IntraRequestType, EventType, ErrorCode, getEvents } from "../intra/event";

/**
 * Redirects to calendar page with today's date
 */
export const Today = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date = moment().format("/YYYY/MM/DD");

    return res.redirect(date);
};

/**
 * Redirects to calendar page with tomorrow's date
 */
export const Tomorrow = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date = moment(new Date()).add(1, "days").format("/YYYY/MM/DD");

    return res.redirect(date);
};

/**
 * Renders calendar page with specific date (in format YYYYMMDD)
 */
export const SpecificDate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date = moment(req.params.year + "-" + req.params.month + "-" + req.params.day);

    if (date.isValid() == false) {
        return res.status(400).render("errors/400", {
            reason: "You asked for a date that does not exist"
        });
    }
    // TODO: maybe handle february 28/29/30/31 ? (on feb 31 it returns march 3)
    // TODO: handle 1 digit months and days and redirect to correct format

    const year: string = moment(date).format("YYYY");
    const month: string = moment(date).format("MM");
    const day: string = moment(date).format("DD");

    let IntraRequest: IntraRequestType = await getEvents(<string>env.AUTOLOGIN, year, month, day);

    if (IntraRequest.Error?.code == ErrorCode.Network) {
        return res.status(500).render("errors/500", {
            technical_error: IntraRequest.Error.message
        });
    }

    if (IntraRequest.Error?.code == ErrorCode.HTTP403) {
        return res.status(403).render("errors/403");
    }

    if (IntraRequest.Error?.code == ErrorCode.HTTPGeneric) {
        return res.status(500).render("errors/500", {
            technical_error: IntraRequest.Error.message
        });
    }

    if (IntraRequest.Error?.code == ErrorCode.BadParsing) {
        return res.status(500).render("errors/500", {
            technical_error: IntraRequest.Error.message
        });
    }

    console.log("adding dummy data");
    IntraRequest.EventList.push({ semester: 3, module: "module", name: "event", registered: true, time: { start: "09:00:00", end: "21:30:00" }, url: "http://x", studentsRegistered: "http://x" });
    IntraRequest.EventList.push({ semester: 1, module: "module2", name: "event2", registered: false, time: { start: "09:00:00", end: "21:30:00" }, url: "http://x", studentsRegistered: "http://x" });

    IntraRequest.EventList.forEach((event: EventType) => {
        console.log(`${event.semester} ${event.module} ${event.name} ${event.registered} from ${event.time.start} to ${event.time.end} ${event.url}`);
    });

    console.log("rendering page");
    return res.render("pages/date", {
        date: moment(date).format("dddd, MMMM Do"),
        events: IntraRequest.EventList
    });
};
