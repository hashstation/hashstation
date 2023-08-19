/**
 * Mutation to set the entire state of a module.
 * 
 * @param  {Function}   stateFactory    a function that returns a fresh state object
 * @return {Function}
 */
export default function (stateFactory) {
    return function (state) {
        Object.assign(state, stateFactory());
    }
}