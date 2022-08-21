import {Helper} from './helper.js';

class ArgumentTypeError extends TypeError {
    constructor(parameterName, expectedType) {
        const message = `Invalid argument type ('${expectedType}' was expected) for the '${parameterName}' parameter.`;
        super(message);
        this.message = message;
    }
}

class Validator {
    static #checkArgumentType(argumentValue, parameterName, expectedType) {
        if (parameterName === undefined || expectedType === undefined) {
            throw new TypeError("Missing arguments 'parameterName' or 'expectedType'.");
        }
        if (typeof expectedType === 'function' || typeof expectedType === 'object') {
            if (!(argumentValue instanceof expectedType)) {
                throw new ArgumentTypeError(parameterName, Helper.classFromClass(expectedType));
            }
        } else {
            if (typeof argumentValue !== expectedType) {
                throw new ArgumentTypeError(parameterName, expectedType);
            }
        }
    }

    static checkArgumentType(argumentValue, parameterName, expectedType, isArray=false) {
        if (!isArray) {
            this.#checkArgumentType(argumentValue, parameterName, expectedType);
        } else {
            this.#checkArgumentType(argumentValue, parameterName, Array);
            this.#checkArgumentType(argumentValue.at(0), parameterName, expectedType);
        }
    }
    static get ARGUMENT_IS_ARRAY() {
        return true;
    };
}

export {ArgumentTypeError, Validator};