import * as request from "request-promise";

/**
 * Function checking if a autologin link works
 * @param autologin autologin to test
 * @returns boolean indicating if the checked passed or failed
 */
export default async function(autologin: string) : Promise<boolean> {
    const RequestURL = "https://intra.epitech.eu/" + autologin + "/user/?format=json";
    const RequestOptions: request.RequestPromiseOptions = {
        json: true,
        headers: {
            "User-Agent": "epi.today"
        }
    };

    try {
        await request.get(RequestURL, RequestOptions, (err, res) => {
            /* network errors */
            if (err || res.statusCode != 200) {
                return false;
            }
        });
    } catch (err) {
        return false;
    }

    return true;
};
