import express from "express";
import dateformat from "dateformat";
import request from "request";

const intra: string = "https://intra.epitech.eu/"
const autologin: string = "auth-xxx";
const query: string = "/planning/load?format=json&start=2020-01-15&end=2020-01-15";
const url: string = intra + autologin + query;

export const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    type EventType = {
        semester: number;
        module: string;
        name: string;
        registration: boolean;
    };
    let EventList: Array<EventType> = [];

    request(url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err) }

        if (!err && res.statusCode == 200) {
            JSON.parse(JSON.stringify(body)).forEach((event: any) => {
                console.log(event.acti_title);
            });
        }
    })

    return res.render("root", {
        date: dateformat(Date.now(), "dddd, mmmm dS")
    });
};
