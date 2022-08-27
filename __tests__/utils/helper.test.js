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
        test("If randomUUID exist, does bot execute require.", () => {
            let window = {
                crypto: {
                    exists: true,
                    randomUUID: () => {}
                }
            };
            
        });
        test("When invoqued, a value is returned.", () => {
            const id = Helper.uuid();
            expect(id).toBeDefined();
        });
    });
});