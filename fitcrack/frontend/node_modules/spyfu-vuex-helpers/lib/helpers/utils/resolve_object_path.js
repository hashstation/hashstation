/**
 * Helper function for resolving nested object values.
 *
 * @param  {Object}         obj         source object
 * @param  {Array|String}   path        path to nested value
 * @param  {String|RegExp}  delimeter   characters / pattern to split path on
 * @return {mixed}
 */
export default function(obj, path, delimeter = '.') {
    const pathArray = Array.isArray(path) ? path : path.split(delimeter);

    return pathArray.reduce((p, item) => p && p[item], obj);
}
