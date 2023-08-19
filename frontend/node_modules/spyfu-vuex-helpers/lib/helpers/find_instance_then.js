/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Object|Function}    required    the config object, or mutation callback
 * @param  {Function}           optional    mutation callback
 * @return {Function}
 */
const findInstanceThen = function () {
    // this function supports two argument signatures. if the
    // first argument is an object, we will use that as the
    // config, and the second arg as the mutation handler
    const { config, callback } = parseArguments(arguments);

    return (state, payload) => {
        if (stateAndPayloadAreValid(config, state, payload)) {

            // find our instance based on the current configuration
            const instance = state[config.stateKey].find(obj => {
                return obj[config.instanceKey] === payload[config.instanceKey];
            });

            // if the instance was found, execute our mutation callback
            if (instance) {
                callback(instance, payload, state);
            }
        }
    }
}

// this method allows us to easily apply configuration to the helper
findInstanceThen.config = opts => findInstanceThen.bind(null, opts);

// helper to get config and callback from the arguments
function parseArguments(args) {
    let defaultConfig = {
        stateKey: 'instances',
        instanceKey: 'id',
    };

    if (typeof args[0] === 'function') {
        return {
            callback: args[0],
            config: defaultConfig,
        }
    } else {
        return {
            callback: args[1],
            config: Object.assign({}, defaultConfig, args[0]),
        };
    }
}

// check if the state or payload is malformed
function stateAndPayloadAreValid(config, state, payload) {

    // ensure that the instances array exists
    if (! Array.isArray(state[config.stateKey])) {
        console.error(`State does not contain an "${ config.stateKey }" array.`);
        return false;
    }

    // ensure that the payload contains an id
    if (typeof payload !== 'object' || typeof payload[config.instanceKey] === 'undefined') {
        console.error(`Mutation payloads must be an object with an "${ config.instanceKey }" property.`);
        return false;
    }

    return true;
}

export default findInstanceThen;
