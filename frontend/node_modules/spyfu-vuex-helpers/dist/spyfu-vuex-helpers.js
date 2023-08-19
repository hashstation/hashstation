(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vuex')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vuex'], factory) :
    (factory((global.spyfuVuexHelpers = {}),global.vuex));
}(this, (function (exports,vuex) { 'use strict';

    /**
     * Mutation to set the entire state of a module.
     * 
     * @param  {Function}   stateFactory    a function that returns a fresh state object
     * @return {Function}
     */
    function assign_state (stateFactory) {
        return function (state) {
            Object.assign(state, stateFactory());
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    var slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    /**
     * Find a state instance, and execute a callback if found.
     *
     * @param  {Object|Function}    required    the config object, or mutation callback
     * @param  {Function}           optional    mutation callback
     * @return {Function}
     */
    var findInstanceThen = function findInstanceThen() {
        // this function supports two argument signatures. if the
        // first argument is an object, we will use that as the
        // config, and the second arg as the mutation handler
        var _parseArguments = parseArguments(arguments),
            config = _parseArguments.config,
            callback = _parseArguments.callback;

        return function (state, payload) {
            if (stateAndPayloadAreValid(config, state, payload)) {

                // find our instance based on the current configuration
                var instance = state[config.stateKey].find(function (obj) {
                    return obj[config.instanceKey] === payload[config.instanceKey];
                });

                // if the instance was found, execute our mutation callback
                if (instance) {
                    callback(instance, payload, state);
                }
            }
        };
    };

    // this method allows us to easily apply configuration to the helper
    findInstanceThen.config = function (opts) {
        return findInstanceThen.bind(null, opts);
    };

    // helper to get config and callback from the arguments
    function parseArguments(args) {
        var defaultConfig = {
            stateKey: 'instances',
            instanceKey: 'id'
        };

        if (typeof args[0] === 'function') {
            return {
                callback: args[0],
                config: defaultConfig
            };
        } else {
            return {
                callback: args[1],
                config: Object.assign({}, defaultConfig, args[0])
            };
        }
    }

    // check if the state or payload is malformed
    function stateAndPayloadAreValid(config, state, payload) {

        // ensure that the instances array exists
        if (!Array.isArray(state[config.stateKey])) {
            console.error('State does not contain an "' + config.stateKey + '" array.');
            return false;
        }

        // ensure that the payload contains an id
        if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) !== 'object' || typeof payload[config.instanceKey] === 'undefined') {
            console.error('Mutation payloads must be an object with an "' + config.instanceKey + '" property.');
            return false;
        }

        return true;
    }

    /**
     * Instance getters.
     *
     * @return {Object}
     */
    function instance_getters () {
        var _parseArguments = parseArguments$1(arguments),
            getters = _parseArguments.getters,
            options = _parseArguments.options;

        return Object.keys(getters).reduce(function (instanceGetters, name) {
            instanceGetters[name] = function (state, otherGetters) {
                return function (instanceKey) {
                    var instance = state[options.stateKey || 'instances'].find(function (obj) {
                        return obj[options.instanceKey || 'id'] === instanceKey;
                    });

                    if (instance) {
                        return getters[name](instance, otherGetters, state, instanceKey);
                    }
                };
            };

            return instanceGetters;
        }, {});
    }

    // parse arguments
    function parseArguments$1(args) {
        var hasOptionsArg = args.length > 1;

        return {
            options: hasOptionsArg ? args[0] : {},
            getters: hasOptionsArg ? args[1] : args[0]
        };
    }

    /**
     * Instance mutations.
     *
     * @return {Object}
     */
    function instance_mutations () {
        var _parseArguments = parseArguments$2(arguments),
            options = _parseArguments.options,
            mutations = _parseArguments.mutations;

        return Object.keys(mutations).reduce(function (instanceMutations, name) {
            instanceMutations[name] = findInstanceThen(options, mutations[name]);

            return instanceMutations;
        }, {});
    }

    // parse arguments
    function parseArguments$2(args) {
        var hasOptionsArg = args.length > 1;

        var defaultOptions = {
            stateKey: 'instances',
            instanceKey: 'id'
        };

        return {
            options: hasOptionsArg ? args[0] : defaultOptions,
            mutations: hasOptionsArg ? args[1] : args[0]
        };
    }

    // Similar to Object.entries but without using polyfill
    function getEntries (obj) {
        return Object.keys(obj).map(function (key) {
            return [key, obj[key]];
        });
    }

    // Function to compose other functions (right to left evaluation)
    function compose () {
        var fns = arguments;

        return function () {
            var result = void 0;

            for (var i = fns.length - 1; i > -1; i--) {
                if (i === fns.length - 1) {
                    result = fns[i].apply(fns[i], arguments);
                } else {
                    result = fns[i].call(this, result);
                }
            }

            return result;
        };
    }

    // Convert KeyValuePair[] to Object
    function toObject (obj, keyValuePair) {
        var _keyValuePair = slicedToArray(keyValuePair, 2),
            key = _keyValuePair[0],
            value = _keyValuePair[1];

        obj[key] = value;

        return obj;
    }

    // Create a wrapper function which invokes the original function
    // passing in `this.id`
    var wrapGetterFn = function wrapGetterFn(_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            key = _ref2[0],
            originalFn = _ref2[1];

        var newFn = function newFn() {
            var innerFn = originalFn.apply(this, arguments);

            if (typeof innerFn !== 'function') {
                /* istanbul ignore next */
                throw 'The getter ' + key + ' does not return a function. Try using the \'mapGetter\' helper instead';
            }

            return innerFn(this.id);
        };

        return [key, newFn];
    };

    function invokeGettersWithId(getters) {
        return getEntries(getters).map(wrapGetterFn).reduce(toObject, {});
    }

    var mapInstanceGetters = compose(invokeGettersWithId, vuex.mapGetters);

    function parseMappingArguments(args) {
        // namespace is optional
        var namespace = typeof args[0] === 'string' ? args[0] : null;

        // mappings are required
        var mappings = namespace ? args[1] : args[0];

        // by default, the vm identifier key will be 'id'
        var vmIdentifierKey = (namespace ? args[2] : args[1]) || 'id';

        // by default, the instance identifier will be 'id'
        var stateKey = 'instances';

        // by default, the state key will be 'instances'
        var instanceIdentifierKey = 'id';

        return {
            namespace: namespace,
            mappings: mappings,
            vmIdentifierKey: vmIdentifierKey,
            instanceIdentifierKey: instanceIdentifierKey,
            stateKey: stateKey
        };
    }

    /**
     * Helper function for resolving nested object values.
     *
     * @param  {Object}         obj         source object
     * @param  {Array|String}   path        path to nested value
     * @param  {String|RegExp}  delimeter   characters / pattern to split path on
     * @return {mixed}
     */
    function resolveObjectPath (obj, path) {
        var delimeter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';

        var pathArray = Array.isArray(path) ? path : path.split(delimeter);

        return pathArray.reduce(function (p, item) {
            return p && p[item];
        }, obj);
    }

    function map_instance_state () {
        // extract our namespace and mappings from the arguments
        var _parseMappingArgument = parseMappingArguments(arguments),
            namespace = _parseMappingArgument.namespace,
            mappings = _parseMappingArgument.mappings,
            vmIdentifierKey = _parseMappingArgument.vmIdentifierKey,
            instanceIdentifierKey = _parseMappingArgument.instanceIdentifierKey,
            stateKey = _parseMappingArgument.stateKey;

        // normalize our mappings


        var normalizedMappings = normalizeMappings(mappings);

        // create a getter for each mapped piece of state
        var computedProperties = {};

        Object.keys(normalizedMappings).forEach(function (key) {
            var computedKey = key.split('.').pop();

            computedProperties[computedKey] = createGetter({
                key: key,
                namespace: namespace,
                normalizedMappings: normalizedMappings,
                vmIdentifierKey: vmIdentifierKey,
                instanceIdentifierKey: instanceIdentifierKey,
                stateKey: stateKey
            });
        });

        return computedProperties;
    }

    // normalize the mappings into a consistent object format
    function normalizeMappings(mappings) {
        if (Array.isArray(mappings)) {
            return mappings.reduce(function (normalizedMappings, key) {
                normalizedMappings[key] = key;

                return normalizedMappings;
            }, {});
        }

        return mappings;
    }

    // create a getter for a particular piece of state
    function createGetter(_ref) {
        var key = _ref.key,
            namespace = _ref.namespace,
            normalizedMappings = _ref.normalizedMappings,
            vmIdentifierKey = _ref.vmIdentifierKey,
            instanceIdentifierKey = _ref.instanceIdentifierKey,
            stateKey = _ref.stateKey;

        return function () {
            var _this = this;

            // find the state object
            var state = namespace ? resolveObjectPath(this.$store.state, namespace, '/') : this.$store.state;

            // find our container of instances
            var instancesContainer = resolveObjectPath(state, stateKey, '.');

            // find our instance within it
            var instance = instancesContainer.find(function (obj) {
                return obj[instanceIdentifierKey] === _this[vmIdentifierKey];
            });

            // and if all goes well, resolve the piece of state we're looking for
            if (instance) {
                return typeof normalizedMappings[key] === 'function' ? normalizedMappings[key](instance) : resolveObjectPath(instance, normalizedMappings[key]);
            }
        };
    }

    // helper to throw consistent errors
    // this is useful in testing to make sure caught errors are ours
    function error (message) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        throw new (Function.prototype.bind.apply(Error, [null].concat(['[spyfu-vuex-helpers]: ' + message], args)))();
    }

    /**
     * Map vuex state with two way computed properties
     *
     * @param  {string|Object}  required the module namespace, or state mappings
     * @param  {Object}         optional state mappings
     * @return {Object}
     */
    function map_two_way_state () {
        // this function supports two argument signatures. if the
        // first argument is a string, we will use that as the
        // namespace, and the next arg as the state mapping
        var _parseArguments = parseArguments$3(arguments),
            namespace = _parseArguments.namespace,
            mappings = _parseArguments.mappings;

        // then get the key and mutation names from our mappings


        var parsedMappings = parseMappings(mappings);

        // and last, turn them into getters and setters
        var computedProperties = {};

        Object.keys(parsedMappings).forEach(function (key) {
            computedProperties[key] = {
                get: createGetter$1(namespace, parsedMappings[key]),
                set: createSetter(namespace, parsedMappings[key])
            };
        });

        return computedProperties;
    }

    // determine the values of our namespace and mappings
    function parseArguments$3(args) {
        var first = args[0];
        var second = args[1];

        return typeof first === 'string' ? { namespace: first, mappings: second } : { namespace: null, mappings: first };
    }

    // determine our key and mutation values
    function parseMappings(obj) {
        var mapping = {};

        // throw a helpful error when mapTwoWayState is mixed up with mapState
        if (Array.isArray(obj)) {
            error('Invalid arguments for mapTwoWayState. State mapping must be an object in { \'path.to.state\': \'mutationName\' } format.');
        }

        Object.keys(obj).forEach(function (key) {
            var value = obj[key];
            var vmKey = key.slice(key.lastIndexOf('.') + 1);

            if (typeof value === 'string') {
                mapping[vmKey] = { key: key, mutation: value };
            } else {
                mapping[vmKey] = { key: value.key, mutation: value.mutation };
            }
        });

        return mapping;
    }

    // create a getter for computed properties
    function createGetter$1(namespace, mapping) {
        if (namespace) {
            return function () {
                var state = resolveObjectPath(this.$store.state, namespace, '/');

                return resolveObjectPath(state, mapping.key, '.');
            };
        }

        return function () {
            return resolveObjectPath(this.$store.state, mapping.key, '.');
        };
    }

    // create a setter for computed properties
    function createSetter(namespace, mappings) {
        var mutation = mappings.mutation;

        if (namespace) {
            mutation = namespace + '/' + mutation;
        }

        return function (value) {
            this.$store.commit(mutation, value);
        };
    }

    /**
     * Simple mutations that set an instance's state equal to a value.
     *
     * @param  {Object}
     * @param  {String}
     * @param  {String}
     * @return {Object}
     */
    function simple_instance_setters (setters) {
        var stateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'instances';
        var instanceKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

        // loop over the setter keys and make a mutation for each
        return Object.keys(setters).reduce(function (mutations, name) {

            // attach our new mutation to result
            return Object.assign({}, mutations, defineProperty({}, name, function (state, payload) {
                // find the instance that we're mutating
                var instance = findInstance(state, stateKey, instanceKey, payload);

                if (instance) {
                    var value = findValue(payload, instanceKey);

                    // if the setter name has a dot, then resolve the
                    // state path before feeding our value into it.
                    if (setters[name].indexOf('.') > -1) {
                        var obj = setters[name].split('.');
                        var key = obj.pop();

                        resolveObjectPath(instance, obj)[key] = value;
                    } else {
                        // otherwise, just set the instance state to our value
                        instance[setters[name]] = value;
                    }
                } else {
                    // if the instance wasn't found, let the dev know with a warning
                    console.warn('An instance with an identifier of ' + instanceKey + ' was not found.');
                }
            }));
        }, {});
    }

    // helper function to find the correct instance
    function findInstance(state, stateKey, instanceKey, payload) {
        return state[stateKey].find(function (obj) {
            return obj[instanceKey] === payload[instanceKey];
        });
    }

    // helper function to find the payload value
    function findValue(payload, instanceKey) {
        for (var key in payload) {
            if (key !== instanceKey) {
                return payload[key];
            }
        }

        // if we don't have a value, throw an error because the payload is invalid.
        /* istanbul ignore next */
        throw new Error('Failed to mutate instance, no value found in payload.', payload);
    }

    /**
     * Simple mutations pushes values onto an array.
     *
     * @param  {Object} pushers Object mapping mutations to state
     * @return {Object}
     */
    function simple_pushers (pushers) {
        return Object.keys(pushers).reduce(function (mutations, name) {
            return _extends({}, mutations, defineProperty({}, name, function (state, value) {
                var mutationName = pushers[name];

                // if the pusher name has a dot, then resolve the
                // array path before pushing our value onto it
                if (mutationName.indexOf('.') > -1) {
                    var obj = mutationName.split('.');
                    var key = obj.pop();
                    var parentObj = resolveObjectPath(state, obj);

                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target path must resolve to an array
                        if (!parentObj || typeof parentObj[key] === 'undefined') {
                            error('simplePusher mutation failed, target "' + mutationName + '" is undefined.');
                        } else if (!Array.isArray(parentObj[key])) {
                            error('simplePusher mutation failed, target "' + mutationName + '" is not an array, ' + _typeof(parentObj[key]) + ' found.');
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
                                error('simplePusher mutation failed, target "' + mutationName + '" is undefined.');
                            } else if (!Array.isArray(state[mutationName])) {
                                error('simplePusher mutation failed, target "' + mutationName + '" is not an array, ' + _typeof(state[mutationName]) + ' found.');
                            }
                        }

                        state[mutationName].push(value);
                    }
            }));
        }, {});
    }

    /* eslint-disable */

    /**
     * Simple mutations that removes a value from an array.
     *
     * @param  {Object} removers     Object mapping mutations to state
     * @return {Object}
     */
    function simple_removers (removers) {
        // loop over the setter keys and make a mutation for each
        return Object.keys(removers).reduce(function (mutations, name) {

            // attach our new mutation to result
            return Object.assign({}, mutations, defineProperty({}, name, function (state, removeVal) {
                var mutationName = removers[name];

                // if the target has a dot, remove our value from the nested array
                if (mutationName.indexOf('.') > -1) {
                    var obj = removers[name].split('.');
                    var key = obj.pop();
                    var parentObj = resolveObjectPath(state, obj);

                    // dev errors
                    if (process.env.NODE_ENV !== 'production') {
                        // target path must resolve to an array
                        if (!parentObj || typeof parentObj[key] === 'undefined') {
                            error('simpleRemover mutation failed, target "' + mutationName + '" is undefined.');
                        } else if (!Array.isArray(parentObj[key])) {
                            error('simpleRemover mutation failed, target "' + mutationName + '" is not an array, ' + _typeof(parentObj[key]) + ' found.');
                        }
                    }

                    parentObj[key] = parentObj[key].filter(function (val) {
                        return val !== removeVal;
                    });
                }

                // otherwise, just remove our value from the array
                else {
                        // dev errors
                        if (process.env.NODE_ENV !== 'production') {
                            // target must be an array
                            if (typeof state[mutationName] === 'undefined') {
                                error('simpleRemover mutation failed, target "' + mutationName + '" is undefined.');
                            } else if (!Array.isArray(state[mutationName])) {
                                error('simpleRemover mutation failed, target "' + mutationName + '" is not an array, ' + _typeof(state[mutationName]) + ' found.');
                            }
                        }

                        state[removers[name]] = state[removers[name]].filter(function (val) {
                            return val !== removeVal;
                        });
                    }
            }));
        }, {});
    }

    /**
     * Simple mutations that set a piece of state equal to a value.
     *
     * @param  {Object} setters     Object mapping mutations to state
     * @return {Object}
     */
    function simple_setters (setters) {
        // loop over the setter keys and make a mutation for each
        return Object.keys(setters).reduce(function (mutations, name) {

            // attach our new mutation to result
            return Object.assign({}, mutations, defineProperty({}, name, function (state, value) {

                // if the setter name has a dot, then resolve the
                // state path before feeding our value into it.
                if (setters[name].indexOf('.') > -1) {
                    var obj = setters[name].split('.');
                    var key = obj.pop();

                    resolveObjectPath(state, obj)[key] = value;
                }

                // otherwise, just set the state to our value
                else state[setters[name]] = value;
            }));
        }, {});
    }

    exports.assignState = assign_state;
    exports.findInstanceThen = findInstanceThen;
    exports.instanceGetters = instance_getters;
    exports.instanceMutations = instance_mutations;
    exports.mapInstanceGetters = mapInstanceGetters;
    exports.mapInstanceState = map_instance_state;
    exports.mapTwoWayState = map_two_way_state;
    exports.resolveObjectPath = resolveObjectPath;
    exports.simpleInstanceSetters = simple_instance_setters;
    exports.simplePushers = simple_pushers;
    exports.simpleRemovers = simple_removers;
    exports.simpleSetters = simple_setters;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=spyfu-vuex-helpers.js.map
