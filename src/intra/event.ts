import request from "request";

type EventType = {
    semester: number;
    module: string;
    name: string;
    registered: boolean;
};

/**
 * Construct events request URL of a date
 * @param autologin user's intra autologin link
 * @param year year of events
 * @param month month of events
 * @param day day of events
 * @returns URL ready to be used
 */
function ConstructRequestURL(autologin: string, year: string, month: string, day: string) : string {
    let RequestURL: string;

    RequestURL  = "https://intra.epitech.eu/" + autologin;
    RequestURL += "/planning/load?format=json";
    RequestURL += "&start=" + year + "-" + month + "-" + day;
    RequestURL += "&end=" + year + "-" + month + "-" + day;

    return RequestURL;
};

/**
 * Function checking if a parsed JSON Object is empty or not
 * Warning: Dirty function that I didn't write, stole it here:
 * https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
 * @param json_parsed parsed JSON
 * @returns whether if Object is empty or not
 */
function isJSONParsingEmpty(json_parsed: any) : boolean {
    for (var key in json_parsed) {
        if (json_parsed.hasOwnProperty(key)) {
            /* object is not empty if a key has its own property */
            return false;
        }
    }
    return true;
};

/**
 * Downloads list of events of a particular date
 * @param autologin user's intra autologin link
 * @param year year of events
 * @param month  month of events
 * @param day day of events
 * @returns Array of matching events (or empty array if there are no events)
 */
function getEvents(autologin: string, year: string, month: string, day: string) : Array<EventType> {
    let EventList: Array<EventType> = [];

    let QueryURL = ConstructRequestURL(autologin, year, month, day);

    request(QueryURL, { json: true }, (err, res, body) => {
        if (err) {
            console.log("intra request() error");
            //TODO: handle when intra is down
        }

        if (res.statusCode == 403) {
            console.log("intra 403");
            //TODO: handle when user is not logged in or does not have access to intra (banned user?)
        }

        if (res.statusCode == 200) {
            console.log("intra 200");

            /* TODO: maybe use something else than JSON.stringify and JSON.parse:
             * they are blocking functions and data can be lost
             */
            const json_string = JSON.stringify(body);
            const json_parsed = JSON.parse(json_string);
            // TODO: return page 500 with technical error if applicable when parsing failed

            /* if there are no events */
            if (isJSONParsingEmpty(json_parsed) == true) {
                console.log("no events");
                /* return an empty EventList */
                return EventList;
            }

            json_parsed.forEach((event: any) => {
                console.log(`we are at ${event.semester} ${event.titlemodule} ${event.acti_title} ${event.event_registered}`);
                EventList.push({
                    semester: event.semester,
                    module: event.titlemodule,
                    name: event.acti_title,
                    registered: (event.event_registered == "registered") ? true : false
                });
            });
            EventList.forEach(event => {
                console.log(`done ${event.semester} ${event.module} ${event.name} ${event.registered}`);
            });
        }
    });

    console.log("done");
    return EventList;
};

export { EventType, getEvents };
