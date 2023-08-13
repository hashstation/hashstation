// helper to throw consistent errors
// this is useful in testing to make sure caught errors are ours
export default function(message, ...args) {
    throw new Error('[spyfu-vuex-helpers]: ' + message, ...args);
}