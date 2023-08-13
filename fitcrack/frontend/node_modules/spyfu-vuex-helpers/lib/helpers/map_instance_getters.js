import { mapGetters } from 'vuex';
import getEntries from './utils/get_entries';
import compose from './utils/compose';
import toObject from './utils/key_value_to_object';

// Create a wrapper function which invokes the original function
// passing in `this.id`
const wrapGetterFn = ([ key, originalFn ]) => {
    const newFn = function () {
        const innerFn = originalFn.apply(this, arguments);

        if (typeof innerFn !== 'function') {
            /* istanbul ignore next */
            throw `The getter ${key} does not return a function. Try using the 'mapGetter' helper instead`;
        }
        
        return innerFn(this.id);
    };

    return [ key, newFn ];
};

function invokeGettersWithId (getters) {
    return getEntries(getters)
        .map(wrapGetterFn)
        .reduce(toObject, {});
}

const mapInstanceGetters = compose(invokeGettersWithId, mapGetters);

export default mapInstanceGetters;
