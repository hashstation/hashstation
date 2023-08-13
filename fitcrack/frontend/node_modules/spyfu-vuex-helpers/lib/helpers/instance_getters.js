
/**
 * Instance getters.
 *
 * @return {Object}
 */
export default function() {
    const { getters, options } = parseArguments(arguments);

    return Object.keys(getters).reduce((instanceGetters, name) => {
        instanceGetters[name] = (state, otherGetters) => instanceKey => {
            const instance = state[options.stateKey || 'instances'].find(obj => {
                return obj[options.instanceKey || 'id'] === instanceKey;
            });

            if (instance) {
                return getters[name](instance, otherGetters, state, instanceKey);
            }
        };

        return instanceGetters;
    }, {});
}

// parse arguments
function parseArguments(args) {
    const hasOptionsArg = args.length > 1;

    return {
        options: hasOptionsArg ? args[0] : {},
        getters: hasOptionsArg ? args[1] : args[0],
    };
}
