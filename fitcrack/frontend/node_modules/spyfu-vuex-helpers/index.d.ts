import { MutationTree } from 'vuex';

declare module "spyfu-vuex-helpers" {
    type simpleSettersInput = { [key: string] : string };
    export function simpleSetters<S>(input: simpleSettersInput): MutationTree<S>;
}