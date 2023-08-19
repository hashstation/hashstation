import resolveObjectPath from './utils/resolve_object_path';
import error from './utils/error';

/**
 * Map vuex state with two way computed properties
 *
 * @param  {string|Object}  required the module namespace, or state mappings
 * @param  {Object}         optional state mappings
 * @return {Object}
 */
export default function () {
    // this function supports two argument signatures. if the
    // first argument is a string, we will use that as the
    // namespace, and the next arg as the state mapping
    const { namespace, mappings } = parseArguments(arguments);

    // then get the key and mutation names from our mappings
    const parsedMappings = parseMappings(mappings);

    // and last, turn them into getters and setters
    const computedProperties = {};

    Object.keys(parsedMappings).forEach((key) => {
        computedProperties[key] = {
            get: createGetter(namespace, parsedMappings[key]),
            set: createSetter(namespace, parsedMappings[key]),
        };
    });

    return computedProperties;
}

// determine the values of our namespace and mappings
function parseArguments(args) {
    const first = args[0];
    const second = args[1];

    return typeof first === 'string'
        ? { namespace: first, mappings: second }
        : { namespace: null, mappings: first };
}

// determine our key and mutation values
function parseMappings(obj) {
    const mapping = {};

    // throw a helpful error when mapTwoWayState is mixed up with mapState
    if (Array.isArray(obj)) {
        error('Invalid arguments for mapTwoWayState. State mapping must be an object in { \'path.to.state\': \'mutationName\' } format.');
    }

    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const vmKey = key.slice(key.lastIndexOf('.') + 1);

        if (typeof value === 'string') {
            mapping[vmKey] = { key, mutation: value };
        } else {
            mapping[vmKey] = { key: value.key, mutation: value.mutation };
        }
    });

    return mapping;
}

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (namespace) {
        return function () {
            const state = resolveObjectPath(this.$store.state, namespace, '/');

            return resolveObjectPath(state, mapping.key, '.');
        };
    }

    return function () {
        return resolveObjectPath(this.$store.state, mapping.key, '.');
    };
}

// create a setter for computed properties
function createSetter(namespace, mappings) {
    let mutation = mappings.mutation;

    if (namespace) {
        mutation = namespace + '/' + mutation;
    }

    return function (value) {
        this.$store.commit(mutation, value)
    };
}
