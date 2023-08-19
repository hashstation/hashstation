// Function to compose other functions (right to left evaluation)
export default function () {
    const fns = arguments;

    return function () {
        let result;
        
        for (let i = fns.length - 1; i > -1; i--) {
            if (i === fns.length - 1) {
                result = fns[i].apply(fns[i], arguments);
            } else {
                result = fns[i].call(this, result);
            }
        }

        return result;
    };
}
