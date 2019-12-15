import request from "request";

type EventType = {
    semester: number;
    module: string;
    name: string;
    registered: boolean;
    time: {
        start: string;
        end: string;
    };
    url: string;
    studentsRegistered: string;
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
    // RequestURL  = "https://localhost/" + autologin;
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
 * @returns Array of matching events (empty array if there are no events) or an error
 */
function getEvents(autologin: string, year: string, month: string, day: string) : Array<EventType> {
    let EventList: Array<EventType> = [];

    const RequestURL = ConstructRequestURL(autologin, year, month, day);
    const RequestOptions: request.CoreOptions = {
        json: true,
        headers: {
            "User-Agent": "epi.today"
        }
    };

    request(RequestURL, RequestOptions, (err, res, body) => {
        if (err) {
            // TODO: return error 500 with error code and handle when connection could not complete
            console.log(err);
            console.log("intra request() error");
        }

        if (res.statusCode == 403) {
            console.log("intra 403");
            //TODO: handle when user is not logged in or does not have access to intra (banned user?)
        }

        if (res.statusCode == 200) {
            console.log("intra 200");

            /* TODO: maybe use something else than JSON.stringify and JSON.parse:
             * they are blocking functions and data can be lost
             * more info here: https://medium.com/@pmzubar/why-json-parse-json-stringify-is-a-bad-practice-to-clone-an-object-in-javascript-b28ac5e36521
             */
            const json_string = JSON.stringify(body);
            let json_parsed;

            try {
                // json_parsed = JSON.parse(json_string);
                json_parsed = JSON.parse("{\"abd:\"jane}");
            } catch(err) {
                console.log(err.message);
                // TODO: return page 500 with technical error if applicable when parsing failed
            }

            /* if there are no events */
            if (isJSONParsingEmpty(json_parsed) == true) {
                console.log("no events");
                /* return an empty EventList */
                return EventList;
            }

            json_parsed.forEach((event: any) => {
                console.log(`we are at ${event.semester} ${event.titlemodule} ${event.acti_title} ${event.event_registered} from ${event.start} to ${event.end} 'https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/'`);
                EventList.push({
                    semester: event.semester,
                    module: event.titlemodule,
                    name: event.acti_title,
                    registered: (event.event_registered == "registered") ? true : false,
                    time: {
                        start: event.start,
                        end: event.end
                    },
                    url: "https://intra.epitech.eu/module/" + event.scolaryear + "/" + event.codemodule + "/" + event.codeinstance + "/" + event.codeacti + "/",
                    studentsRegistered: "https://intra.epitech.eu/module/" + event.scolaryear + "/" + event.codemodule + "/" + event.codeinstance + "/" + event.codeacti + "/" + event.codeevent + "/registered/"
                });
            });
            EventList.forEach(event => {
                console.log(`done ${event.semester} ${event.module} ${event.name} ${event.registered} from ${event.time.start} to ${event.time.end} ${event.url}`);
            });
        }
    });

    console.log("done");
    return EventList;
};

export { EventType, getEvents };
