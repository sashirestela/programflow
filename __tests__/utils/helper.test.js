import { describe, test, expect } from '@jest/globals';
import { Helper } from '../../src/utils/helper.js';

class TestClass {
    constructor(a,b) {
        this.a = a;
        this.b = b;
    }
}

describe("Helper class", () => {
    describe("classFromObject method", () => {
        test("If an object is passed, its class's name should be returned.", () => {
            const obj = new TestClass(1,2);
            const result = Helper.classFromObject(obj);
            expect(result).toBe("TestClass");
        });
        test("If an object is not passed, an error is raised.", () => {
            expect(() => Helper.classFromObject(TestClass)).toThrow(TypeError);
        });
    });
    describe("classFromClass method", () => {
        test("If a class is passed, its name should be returned.", () => {
            const result = Helper.classFromClass(TestClass);
            expect(result).toBe("TestClass");
        });
        test("If a class is not passed, a TypError is raised.", () => {
            const obj = new TestClass(1,2);
            expect(() => Helper.classFromClass(obj)).toThrow(TypeError);
        });
    });
    describe("uuid method", () => {
        test("When invoqued, a value is returned.", () => {
            const id = Helper.uuid();
            expect(id).toBeDefined();
        });
    });
    describe("pipeRevivers function", () => {
        test("Stringified object is parsed and transformed by a sequence of functions.", () => {
            const obj = {
                value:{
                    gender: "Male",
                    firstName: "Peter",
                    lastName: "Parker",
                    age: 25
                }
            };
            const funcSalutation = (k,v) => {
                if (v.gender !== undefined) {
                    v.salutation = v.gender === "Male" ? "Mr." : "Ms.";
                }
                return v;
            };
            const funcAdult = (k,v) => {
                if (v.age !== undefined) {
                    v.adult = v.age > 18 ? true : false;
                }
                return v;
            };
            const str = JSON.stringify(obj);
            const result = JSON.parse(str, Helper.pipeRevivers(funcSalutation, funcAdult));
            expect(result.value.salutation).toBe("Mr.");
            expect(result.value.adult).toBe(true);
        });
    });
});