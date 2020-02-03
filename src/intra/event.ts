import * as request from "request-promise";
import moment from "moment";
import isJSONParsingEmpty from "../tools/isJSONParsingEmpty";

/* where the events will be stored */
type EventType = {
    semester: number;
    module: string;
    name: string;
    registered: boolean;
    teacher: string;
    time: {
        start: string;
        end: string;
    };
    url: string;
    studentsRegistered: string;
};

/* codes of possible errors */
enum ErrorCode {
    Network,
    HTTP403,
    HTTPGeneric,
    BadParsing
}

/* where the eventual error will be stored */
type ErrorType = {
    code: ErrorCode;
    message?: String;
};

/* where the output of getEvents() will be stored */
type IntraRequestType = {
    EventList: Array<EventType>;
    Error?: ErrorType;
};

/**
 * Construct events request URL of a date
 * @param autologin user's intra autologin link
 * @param year year of events
 * @param month month of events
 * @param day day of events
 * @returns URL ready to be used
 */
function ConstructRequestURL(autologin: string, year: string, month: string, day: string): string {
    let RequestURL: string;

    RequestURL = "https://intra.epitech.eu/" + autologin;
    // RequestURL  = "https://intra.epitech.eu/"; /* 403 error */
    // RequestURL  = "http://localhost:123/"; /* unreachable */

    RequestURL += "/planning/load?format=json";
    RequestURL += "&start=" + year + "-" + month + "-" + day;
    RequestURL += "&end=" + year + "-" + month + "-" + day;

    return RequestURL;
};

/**
 * Stores JSON in EventList
 * @param json raw json
 * @param IntraRequest
 * @param current_semester current semester of student
 */
function storeJSON(json: any, IntraRequest: IntraRequestType, current_semester: number) {
    json.forEach((event: any) => {
        /*
         * current_semester == 0 -> account is a pedagogical account
         * event.semester == current_semester -> event belongs to current semester
         * event.semester == (current_semester - 1) -> event belongs to previous semester
         * event.semester == 0 -> event belongs to semester 0 (hub, com, etc)
         */
        if (current_semester == 0 || event.semester == current_semester || event.semester == (current_semester - 1) || event.semester == 0) {
            IntraRequest.EventList.push({
                semester: event.semester,
                module: event.titlemodule,
                name: event.acti_title,
                registered: (event.event_registered == "registered" || event.event_registered == "present") ? true : false,
                teacher: event.title,
                time: {
                    start: moment(event.start).format("HH:mm"),
                    end: moment(event.end).format("HH:mm")
                },
                url: `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/`,
                studentsRegistered: (event.is_rdv == "1") ? `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/rdv/` : `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/${event.codeevent}/registered`,
            });
        }
    });
}

/**
 * Downloads list of events of a particular date
 * @param autologin user's intra autologin link
 * @param year year of events
 * @param month  month of events
 * @param day day of events
 * @param current_semester number of current semester of student
 * @returns Array of matching events (empty array if there are no events) or an error
 */
async function getEvents(autologin: string, year: string, month: string, day: string, current_semester: number): Promise<IntraRequestType> {
    /* declare an empty IntraRequestType with a empty EventList */
    let IntraRequest: IntraRequestType = <IntraRequestType>{};
    IntraRequest.EventList = [];

    const RequestURL = ConstructRequestURL(autologin, year, month, day);
    const RequestOptions: request.RequestPromiseOptions = {
        json: true,
        headers: {
            "User-Agent": "epi.today"
        }
    };

    try {
        await request.get(RequestURL, RequestOptions, (err, res, body) => {

            /* network errors */
            if (err) {
                IntraRequest.Error = <ErrorType>{};
                IntraRequest.Error.code = ErrorCode.Network;
                IntraRequest.Error.message = err;
                return IntraRequest;
            }

            if (res.statusCode == 200) {
                /* TODO: maybe use something else than JSON.stringify and JSON.parse:
                 * they are blocking functions and data can be lost
                 * more info here: https://medium.com/@pmzubar/why-json-parse-json-stringify-is-a-bad-practice-to-clone-an-object-in-javascript-b28ac5e36521
                 */
                const json_string = JSON.stringify(body);
                let json_parsed;

                try {
                    json_parsed = JSON.parse(json_string);
                    // json_parsed = JSON.parse("{\"abd:\"jane}"); /* used to simulate a bad json string */
                } catch (err) {
                    /* store parsing error */
                    IntraRequest.Error = <ErrorType>{};
                    IntraRequest.Error.code = ErrorCode.BadParsing;
                    IntraRequest.Error.message = err.message;
                    return IntraRequest;
                }

                /* if there are no events */
                if (isJSONParsingEmpty(json_parsed) == true) {
                    return IntraRequest;
                }

                storeJSON(json_parsed, IntraRequest, current_semester);
            }
        });
    } catch (err) {
        /* catch HTTP errors */
        IntraRequest.Error = <ErrorType>{};
        if (err.statusCode == 403) {
            IntraRequest.Error.code = ErrorCode.HTTP403;
        } else {
            IntraRequest.Error.code = ErrorCode.HTTPGeneric;
        }
        IntraRequest.Error.message = err;
        return IntraRequest;
    }

    return IntraRequest;
};

export { IntraRequestType, EventType, ErrorCode, getEvents };
