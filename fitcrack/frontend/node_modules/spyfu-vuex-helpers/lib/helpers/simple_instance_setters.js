import resolveObjectPath from './utils/resolve_object_path';

/**
 * Simple mutations that set an instance's state equal to a value.
 *
 * @param  {Object}
 * @param  {String}
 * @param  {String}
 * @return {Object}
 */
export default function(
    setters,
    stateKey = 'instances',
    instanceKey = 'id'
) {
    // loop over the setter keys and make a mutation for each
    return Object.keys(setters).reduce((mutations, name) => {

        // attach our new mutation to result
        return Object.assign({}, mutations, {
            [name](state, payload) {
                // find the instance that we're mutating
                const instance = findInstance(state, stateKey, instanceKey, payload);

                if (instance) {
                    const value = findValue(payload, instanceKey);

                    // if the setter name has a dot, then resolve the
                    // state path before feeding our value into it.
                    if (setters[name].indexOf('.') > -1) {
                        const obj = setters[name].split('.');
                        const key = obj.pop();

                        resolveObjectPath(instance, obj)[key] = value;
                    } else {
                        // otherwise, just set the instance state to our value
                        instance[setters[name]] = value;
                    }
                } else {
                    // if the instance wasn't found, let the dev know with a warning
                    console.warn (`An instance with an identifier of ${instanceKey} was not found.`);
                }
            },
        });
    }, {});
}

// helper function to find the correct instance
function findInstance(state, stateKey, instanceKey, payload) {
    return state[stateKey].find(obj => obj[instanceKey] === payload[instanceKey]);
}

// helper function to find the payload value
function findValue(payload, instanceKey) {
    for (let key in payload) {
        if (key !== instanceKey) {
            return payload[key];
        }
    }

    // if we don't have a value, throw an error because the payload is invalid.
    /* istanbul ignore next */
    throw new Error('Failed to mutate instance, no value found in payload.', payload);
}
