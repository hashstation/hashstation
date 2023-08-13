export function parseMappingArguments(args) {
    // namespace is optional
    const namespace = typeof args[0] === 'string' ? args[0] : null;

    // mappings are required
    const mappings = namespace ? args[1] : args[0];

    // by default, the vm identifier key will be 'id'
    const vmIdentifierKey = (namespace ? args[2] : args[1]) || 'id';

    // by default, the instance identifier will be 'id'
    const stateKey = 'instances';

    // by default, the state key will be 'instances'
    const instanceIdentifierKey = 'id';

    return {
        namespace,
        mappings,
        vmIdentifierKey,
        instanceIdentifierKey,
        stateKey,
     };
}
