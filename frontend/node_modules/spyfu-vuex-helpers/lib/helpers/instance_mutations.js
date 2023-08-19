import findInstanceThen from './find_instance_then';

/**
 * Instance mutations.
 *
 * @return {Object}
 */
export default function() {
    const { options, mutations } = parseArguments(arguments);

    return Object.keys(mutations).reduce((instanceMutations, name) => {
        instanceMutations[name] = findInstanceThen(options, mutations[name]);

        return instanceMutations;
    }, {});
}

// parse arguments
function parseArguments(args) {
    const hasOptionsArg = args.length > 1;

    const defaultOptions = {
        stateKey: 'instances',
        instanceKey: 'id',
    };

    return {
        options: hasOptionsArg ? args[0] : defaultOptions,
        mutations: hasOptionsArg ? args[1] : args[0],
    };
}
