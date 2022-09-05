let crypto;
try {
    crypto = require('crypto');
} catch(e) {
    crypto = window.crypto;
}

class Helper {
    static classFromObject(object) {
        if (typeof object !== 'object') {
            throw new TypeError("Invalid argument type ('object' was expected).");
        }
        return Object.getPrototypeOf(object).constructor.name;
    }

    static classFromClass(clazz) {
        if (typeof clazz !== 'function') {
            throw new TypeError("Invalid argument type ('class' was expected).");
        }
        return clazz.prototype.constructor.name;
    }

    static uuid() {
        return crypto.randomUUID();
    }

    static pipeRevivers(...fns) {
        return fns.reduce((f, g) => (k, v) => g(k, f(k,v)));
    };
}

export { Helper };