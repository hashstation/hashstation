// Similar to Object.entries but without using polyfill
export default function (obj) {
    return Object.keys(obj).map(key => [ key, obj[key] ]);
}
