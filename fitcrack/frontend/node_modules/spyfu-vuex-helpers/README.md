# spyfu-vuex-helpers

[![Build status](https://img.shields.io/circleci/project/github/spyfu/spyfu-vuex-helpers.svg)](https://circleci.com/gh/spyfu/spyfu-vuex-helpers)
[![Coverage](https://img.shields.io/codecov/c/token/ZnYz3FuhI5/github/spyfu/spyfu-vuex-helpers.svg)](https://codecov.io/gh/spyfu/spyfu-vuex-helpers)
[![Dev dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vuex-helpers.svg)](https://david-dm.org/spyfu/spyfu-vuex-helpers?type=dev)
[![npm](https://img.shields.io/npm/v/spyfu-vuex-helpers.svg)](https://www.npmjs.com/package/spyfu-vuex-helpers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/spyfu/spyfu-vuex-helpers/blob/master/LICENSE)

<a name="introduction"></a>
### Introduction

These utility functions are intended for use with [Vuex](https://vuex.vuejs.org/en). To install the helpers, run one of the following commands.

```bash
# install through npm
$ npm install spyfu-vuex-helpers

# or with yarn
$ yarn add spyfu-vuex-helpers
```

- [assignState](#assign-state)
- [findInstanceThen](#find-instance-then)
- [instanceGetters](#instance-getters)
- [instanceMutations](#instance-mutations)
- [mapInstanceGetters](#map-instance-getters)
- [mapInstanceState](#map-instance-state)
- [mapTwoWayState](#map-two-way-state)
- [resolveObjectPath](#resolve-object-path)
- [simpleInstanceSetters](#simple-instance-setters)
- [simplePushers](#simple-pushers)
- [simpleRemovers](#simple-removers)
- [simpleSetters](#simple-setters)

<a name="assign-state"></a>
### assignState

Occasionally, you'll need to set the entire state of a module at once. This is typically done to reset a module back to it's original state. In these situations, the `assignState` helper can be used.

```js
import { assignState } from 'spyfu-vuex-helpers';

export default {
    reset: assignState(defaultStateFn),
}
```

<a name="find-instance-then"></a>
### findInstanceThen

This function helps with keeping multiple copies of the same state. One way to do this is for your state to be nothing more than an array of objects. The `findInstanceThen` helper can then be used to map your mutations to a particular instance.

> **Note:** If you're writing more than one or two mutations, using [`instanceMutations`](#instance-mutations) might be a better choice.

```js
import { findInstanceThen } from 'spyfu-vuex-helpers';

export default {
    // state should contain an array called "instances"
    // with each instance defining an "id" property.
    state: {
        instances: [],
    },

    // to mutate particular instances, use the findInstanceThen
    // function and attach an "id" property to your payload.
    mutations: {
        someMutation: findInstanceThen((instance, payload, state) => {
            instance.foo = payload.value;
        }),
    },
}
```

If you need to use a state key other than `instances`, or an instance key other than `id`, use the `config` method.

```js
import helpers from 'spyfu-vuex-helpers';

const findInstanceThen = helpers.findInstanceThen.config({
    stateKey: 'foo',
    instanceKey: 'bar',
});
```

<a name="instance-getters"></a>
### instanceGetters

A simple helper to find instances and return computed state from them. If an instance is not found, the getter will return `undefined`.

```js
import { instanceGetters } from 'spyfu-vuex-helpers';

export default {
    ...instanceGetters({
        someGetters(instance, otherGetters, state) {
            return instance.whatever;
        },
    }),
}
```

<a name="instance-mutations"></a>
### instanceMutations

This helper wraps multiple mutations in [`findInstanceThen`](#find-instance-then). By default, the state key will be `instances` and the instance idenfitier key will be `id`. These keys can be customized by providing an object as the first argument with different `stateKey` or `instanceKey` values.

```js
import { instanceMutations } from 'spyfu-vuex-helpers';

export default {
    ...instanceMutations({
        someMutation(instance, payload, state) {
            instance.key = payload.key;
        },
    }),
}
```

<a name="map-instance-getters"></a>
### mapInstanceGetters

When keeping your state as an array in Vuex, it becomes necessary to retrieve the instance inside of your getter. The easiest way to do that is to have your getter return a function that takes the ID of the instance to retreive, so you can access the piece of state you need. So your getters end up looking like:

```js
const getters = {
    isLoading: (state) => (id) => findInstance(id).isLoading,
};
```

Well, that's pretty straight-forward. However, in my component, I now need to manually reference the getter in order to make this work since the standard `mapGetters` helper won't work as expected. This helper takes the place of the standard `mapGetters` helper and will invoke the function returned by the getter for you with the instances id for you.

mapInstanceGetters has the **exact** same API as the default Vuex `mapGetters` helper.

In order for this helper to work, you must have either a piece of state called `id` or a prop called `id` that contains the ID of your instance.

```js
import { mapInstanceGetters } from 'spyfu-vuex-helpers';

export default {
    data() {
        return { id: 0 }
    },

    computed: {
        ...mapInstanceGetters('namespace', ['getterOne', 'getterTwo' ]),
    },
}
```

<a name="map-instance-state"></a>
### mapInstanceState

Simply maps state from an instance. This function supports an optional namespace as the first argument. Also, this function also supports a third argument to define the vm's instance identifier, By default, this value will be `id`.

```js
export default {
    computed: {
        // array syntax
        ...mapInstanceState([
            'path.to.state',
        ]),

        // object / string syntax
        ...mapInstanceState({
            localKey: 'path.to.state',
        }),

        // object / function syntax
        ...mapInstanceState({
            localKey: instance => instance.whatever,
        }),
    }
}
```

<a name="map-two-way-state"></a>
### mapTwoWayState

Occasionally, you'll need to both get and mutate Vuex state from a component. Normally, you might use a [two way computed property](https://vuejs.org/v2/guide/computed.html#Computed-Setter).

```js
export default {
    computed: {
        isLoading: {
            get() {
                return this.$store.state.isLoading;
            },
            set(value) {
                this.$store.commit('setIsLoading', value);
            },
        },
    },
}
```

To avoid writing these redundant getters and setters, we can use the `mapTwoWayState` helper. An optional store `namespace` may be passed in as the first argument.

```js
import { mapTwoWayState } from 'spyfu-vuex-helpers';

export default {
    computed: {
        ...mapTwoWayState({
            isLoading: 'setIsLoading',
        }),
    },
}
```

In the above example, your Vuex state will be exposed as `isLoading`. When updated, the `setIsLoading` mutation will be called. If you need to use a different key name from the one in Vuex, use the following object syntax.

```js
thingIsLoading: { key: 'isLoading', mutation: 'setIsLoading' }
```

<a name="resolve-object-path"></a>
### resolveObjectPath

This utility resolves the value of a nested object from a string path. It is typically used to access the state of nested modules.

```js
import { resolveObjectPath } from 'spyfu-vuex-helpers';

const value = resolveObjectPath(state, 'some.nested.module.stateKey');
```

Optionally, a third argument can be provided to use a delimeter other than the default of `.`.

<a name="simple-instance-setters"></a>
### simpleInstanceSetters

Similar to [`simpleSetters`](#simple-setters), but for use with the state instances pattern. The second and third arguments can define the state key and instance identifier key. By default, they are set to `instances` and `id` respectively.

```js
import { simpleInstanceSetters } from 'spyfu-vuex-helpers';

export default {
    ...simpleInstanceSetters({
        mutationName: 'path.to.state',
    }),
}
```

<a name="simple-pushers"></a>
### simplePushers

Similar to [`simpleSetters`](#simple-setters), but pushes a value onto an array.

```js
import { simplePushers } from 'spyfu-vuex-helpers';

export default {
    ...simplePusher({
        mutationName: 'path.to.array',
    }),
}
```

<a name="simple-removers"></a>
### simpleRemovers

Similar to [`simplePushers`](#simple-pushers), this helper filters a value out of an array.

```js
import { simplePushers } from 'spyfu-vuex-helpers';

export default {
    ...simpleRemovers({
        mutationName: 'path.to.array',
    }),
}
```

<a name="simple-setters"></a>
### simpleSetters

Often a mutation exists only to take some input, and put it somewhere in state. In these situations, we can use the `simpleSetters` helper to map mutation names to state.

```js
import { simpleSetters } from 'spyfu-vuex-helpers';

export default {
    ...simpleSetters({
        mutationName: 'path.to.state',
    }),
}
```

### License

[MIT](https://github.com/spyfu/spyfu-vuex-helpers/blob/master/LICENSE)

Copyright (c) 2017-present, [SpyFu](https://spyfu.com)
