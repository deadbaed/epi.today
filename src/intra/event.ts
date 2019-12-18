import * as request from "request-promise";
import moment from "moment";
import { StudentType, getStudent } from "../intra/student";

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

enum ErrorCode {
    Network,
    HTTP403,
    HTTPGeneric,
    BadParsing
}

type ErrorType = {
    code: ErrorCode;
    message?: String;
};

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
function ConstructRequestURL(autologin: string, year: string, month: string, day: string) : string {
    let RequestURL: string;

    RequestURL  = "https://intra.epitech.eu/" + autologin;
    // RequestURL  = "https://intra.epitech.eu/"; /* 403 error */
    // RequestURL  = "http://localhost:123/"; /* unreachable */
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
 * Stores JSON in EventList
 * @param json raw json
 * @param IntraRequest
 * @param Student
 */
function storeJSON(json: any, IntraRequest: IntraRequestType, Student: StudentType) {
    json.forEach((event: any) => {
        if (event.semester == Student.semester || event.semester == 0) {
            IntraRequest.EventList.push({
                semester: event.semester,
                module: event.titlemodule,
                name: event.acti_title,
                registered: (event.event_registered == "registered" || event.event_registered == "present") ? true : false,
                time: {
                    start: moment(event.start).format("HH:mm"),
                    end: moment(event.end).format("HH:mm")
                },
                url: `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/`,
                studentsRegistered: `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/${event.codeevent}/registered/`
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
 * @returns Array of matching events (empty array if there are no events) or an error
 */
async function getEvents(autologin: string, year: string, month: string, day: string) : Promise<IntraRequestType> {
    const Student: StudentType = await getStudent(autologin);
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

                storeJSON(json_parsed, IntraRequest, Student);
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
