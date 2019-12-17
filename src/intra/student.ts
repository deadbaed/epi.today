import * as request from "request-promise";

type StudentType = {
    name: {
        first: string;
        last: string;
    };
    email: string;
    year: number;
    credits: number;
    gpa: string;
    log: number;
};

async function getStudent(autologin: string) : Promise<StudentType> {
    let Student: StudentType = <StudentType>{};

    const RequestURL = "https://intra.epitech.eu/" + autologin + "/user/?format=json";
    const RequestOptions: request.RequestPromiseOptions = {
        json: true,
        headers: {
            "User-Agent": "epi.today"
        }
    };

    await request.get(RequestURL, RequestOptions, (err, res, body) => {

        /* network errors */
        if (err) {
            return;
        }

        if (res.statusCode == 200) {
            const json_string = JSON.stringify(body);
            let json_parsed;

            try {
                json_parsed = JSON.parse(json_string);
            } catch (err) {
                return;
            }

            Student = {
                name: {
                    first: json_parsed.firstname,
                    last: json_parsed.lastname
                },
                email: json_parsed.login,
                year: json_parsed.studentyear,
                credits: json_parsed.credits,
                gpa: json_parsed.gpa[0].gpa,
                log: json_parsed.nsstat.active
            };
        }
    });

    return Student;
};

export { StudentType, getStudent };
