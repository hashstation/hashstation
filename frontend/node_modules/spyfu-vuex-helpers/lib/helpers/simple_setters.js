import resolveObjectPath from './utils/resolve_object_path';

/**
 * Simple mutations that set a piece of state equal to a value.
 *
 * @param  {Object} setters     Object mapping mutations to state
 * @return {Object}
 */
export default function(setters) {
    // loop over the setter keys and make a mutation for each
    return Object.keys(setters).reduce((mutations, name) => {

        // attach our new mutation to result
        return Object.assign({}, mutations, {
            [name](state, value) {

                // if the setter name has a dot, then resolve the
                // state path before feeding our value into it.
                if (setters[name].indexOf('.') > -1) {
                    const obj = setters[name].split('.');
                    const key = obj.pop();

                    resolveObjectPath(state, obj)[key] = value;
                }

                // otherwise, just set the state to our value
                else state[setters[name]] = value;
            },
        });
    }, {});
}
