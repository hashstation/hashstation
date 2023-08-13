// Convert KeyValuePair[] to Object
export default function (obj, keyValuePair) {
    const [ key, value ] = keyValuePair;
    obj[key] = value;

    return obj;
}
