/**
 * Function checking if a parsed JSON Object is empty or not
 * Warning: Dirty function that I didn't write, stole it here:
 * https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
 * @param parsedJSON JSON
 * @returns whether if Object is empty or not
 */
export default function(parsedJSON: any) : boolean {
    for (var key in parsedJSON) {
        if (parsedJSON.hasOwnProperty(key)) {
            /* object is not empty if a key has its own property */
            return false;
        }
    }
    /* object is empty if at the end no empty objects could be found */
    return true;
};
