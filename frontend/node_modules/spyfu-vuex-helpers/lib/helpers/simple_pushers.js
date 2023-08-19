import error from './utils/error';
import resolveObjectPath from './utils/resolve_object_path';

/**
 * Simple mutations pushes values onto an array.
 *
 * @param  {Object} pushers Object mapping mutations to state
 * @return {Object}
 */
export default function(pushers) {
    return Object.keys(pushers).reduce((mutations, name) => {
        return {
            ...mutations,
            [name](state, value) {
                const mutationName = pushers[name];

                // if the pusher name has a dot, then resolve the
                // array path before pushing our value onto it
                if (mutationName.indexOf('.') > -1) {
                    const obj = mutationName.split('.');
                    const key = obj.pop();
                    const parentObj = resolveObjectPath(state, obj);

                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target path must resolve to an array
                        if (!parentObj || typeof parentObj[key] === 'undefined') {
                            error(`simplePusher mutation failed, target "${mutationName}" is undefined.`);
                        } else if (!Array.isArray(parentObj[key])) {
                            error(`simplePusher mutation failed, target "${mutationName}" is not an array, ${typeof parentObj[key]} found.`);
                        }
                    }
                    
                    parentObj[key].push(value);
                }

                // otherwise, just push our value onto the array
                else {

                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target must be an array
                        if (typeof state[mutationName] === 'undefined') {
                            error(`simplePusher mutation failed, target "${mutationName}" is undefined.`);
                        } else if (!Array.isArray(state[mutationName])) {
                            error(`simplePusher mutation failed, target "${mutationName}" is not an array, ${typeof state[mutationName]} found.`);
                        }
                    }

                    state[mutationName].push(value);
                }
            },
        }
    }, {});
}