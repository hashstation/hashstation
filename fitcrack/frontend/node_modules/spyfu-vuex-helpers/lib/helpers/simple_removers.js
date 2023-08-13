/* eslint-disable */
import error from './utils/error';
import resolveObjectPath from './utils/resolve_object_path';

/**
 * Simple mutations that removes a value from an array.
 *
 * @param  {Object} removers     Object mapping mutations to state
 * @return {Object}
 */
export default function(removers) {
    // loop over the setter keys and make a mutation for each
    return Object.keys(removers).reduce((mutations, name) => {

        // attach our new mutation to result
        return Object.assign({}, mutations, {
            [name](state, removeVal) {
                const mutationName = removers[name];

                // if the target has a dot, remove our value from the nested array
                if (mutationName.indexOf('.') > -1) {
                    const obj = removers[name].split('.');
                    const key = obj.pop();
                    const parentObj = resolveObjectPath(state, obj);

                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target path must resolve to an array
                        if (!parentObj || typeof parentObj[key] === 'undefined') {
                            error(`simpleRemover mutation failed, target "${mutationName}" is undefined.`);
                        } else if (!Array.isArray(parentObj[key])) {
                            error(`simpleRemover mutation failed, target "${mutationName}" is not an array, ${typeof parentObj[key]} found.`);
                        }
                    }
                    
                    parentObj[key] = parentObj[key].filter(val => val !== removeVal);
                }

                // otherwise, just remove our value from the array
                else {
                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target must be an array
                        if (typeof state[mutationName] === 'undefined') {
                            error(`simpleRemover mutation failed, target "${mutationName}" is undefined.`);
                        } else if (!Array.isArray(state[mutationName])) {
                            error(`simpleRemover mutation failed, target "${mutationName}" is not an array, ${typeof state[mutationName]} found.`);
                        }
                    }

                    state[removers[name]] = state[removers[name]].filter(val => val !== removeVal);
                }
            },
        });
    }, {});
}
