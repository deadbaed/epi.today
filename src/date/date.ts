import express from "express";
import moment from "moment";
import env from "../env";
import { IntraRequestType, EventType, ErrorCode, getEvents } from "../intra/event";

/**
 * Renders page with a date selector which will redirect to requested date
 */
export const DateSelector = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.render("pages/selector");
};

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
    /* parse date, make sure the final format is YYYY-MM-DD */
    const date = moment(req.params.year + "-" + req.params.month + "-" + req.params.day, "YYYY-MM-DD", true);

    /* if date is invalid or format is not respected */
    if (date.isValid() == false) {
        return res.status(400).render("errors/400", {
            reason: "You asked for a date that does not exist"
        });
    }

    /* calculate the day before and after */
    const yesterday = moment(date).subtract(1, "days");
    const tomorrow = moment(date).add(1, "days");

    /* store the requested date in correct format */
    const year: string = moment(date).format("YYYY");
    const month: string = moment(date).format("MM");
    const day: string = moment(date).format("DD");

    let IntraRequest: IntraRequestType = await getEvents(<string>env.AUTOLOGIN, year, month, day);

    if (IntraRequest.Error) {
        if (IntraRequest.Error.code == ErrorCode.HTTP403) {
            /* render 403 page */
            return res.status(403).render("errors/403", {
                technical_error: IntraRequest.Error.message
            });
        } else if (
            IntraRequest.Error.code == ErrorCode.BadParsing ||
            IntraRequest.Error.code == ErrorCode.HTTPGeneric ||
            IntraRequest.Error.code == ErrorCode.Network) {
            /* render 500 page */
            return res.status(500).render("errors/500", {
                technical_error: IntraRequest.Error.message
            });
        }
    }

    return res.render("pages/date", {
        date: moment(date).format("dddd, MMMM Do"),
        events: IntraRequest.EventList,
        yesterday: moment(yesterday).format("dddd"),
        yesterdayLink: moment(yesterday).format("/YYYY/MM/DD"),
        tomorrow: moment(tomorrow).format("dddd"),
        tomorrowLink: moment(tomorrow).format("/YYYY/MM/DD")
    });
};
