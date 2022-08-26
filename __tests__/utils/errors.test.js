import { describe, test, expect } from '@jest/globals';
import { ArgumentTypeError, Validator } from '../../public/js/utils/errors.js';

class AuxClass {
    constructor(id) {
        this.id = id;
    }
}

describe("Validator class", () => {
    describe("checkArgumentType method", () => {
        test("If parameterName or expectedType arguments are missed, a TypeError is raised.", () => {
            expect(() => Validator.checkArgumentType(7)).toThrow(TypeError);
            expect(() => Validator.checkArgumentType(7, "paramName")).toThrow(TypeError);
            expect(() => Validator.checkArgumentType({}, undefined, Array)).toThrow(TypeError);
        });
        test("If expectedType is scalar and argumentValue's type is the expected, then validation pass.", () => {
            const argumentValue = "Peter";
            const parameterName = "firstName";
            const expectedType = "string";
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow();
        });
        test("If expectedType is scalar and argumentValue's type isn't the expected, then validation fails.", () => {
            const argumentValue = "twenty";
            const parameterName = "age";
            const expectedType = "number";
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError);
        });
        test("If expectedType is class and argumentValue's type is the expected, then validation pass.", () => {
            const argumentValue = new AuxClass(1);
            const parameterName = "id";
            const expectedType = AuxClass;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow();
        });
        test("If expectedType is class and argumentValue's type isn't the expected, then validation fails.", () => {
            const argumentValue = new Date();
            const parameterName = "dateOfBirth";
            const expectedType = AuxClass;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError);
        });
        test("If expectedType is object and argumentValue's type is the expected, then validation pass.", () => {
            const argumentValue = {a:1,b:2};
            const parameterName = "confObject";
            const expectedType = Object;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow();
        });
        test("If expectedType is object and argumentValue's type isn't the expected, then validation fails.", () => {
            const argumentValue = new AuxClass(2);
            const parameterName = "auxiliar";
            const expectedType = Object;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError);
        });
        test("For array, if expectedType and argumentValue's type are the same, then validation pass.", () => {
            const argumentValue = [new AuxClass(1), new AuxClass(2)];
            const parameterName = "auxiliarList";
            const expectedType = AuxClass;
            const isArray = Validator.ARGUMENT_IS_ARRAY;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).not.toThrow();
        });
        test("For array, if expectedType and argumentValue's type aren't the same, then validation fails.", () => {
            const argumentValue = ["element1", "element2"];
            const parameterName = "auxiliarList";
            const expectedType = AuxClass;
            const isArray = Validator.ARGUMENT_IS_ARRAY;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).toThrow(ArgumentTypeError);
        });
        test("For array, if argumentValue is an empty array, then validation pass.", () => {
            const argumentValue = [];
            const parameterName = "auxiliarList";
            const expectedType = AuxClass;
            const isArray = Validator.ARGUMENT_IS_ARRAY;
            expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).not.toThrow();
        });
    });
});