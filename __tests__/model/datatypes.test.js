import { describe, test, expect } from '@jest/globals';
import { DataType, Primitive, List, Matrix, Map } from '../../src/model/datatypes.js';
import { ArgumentTypeError } from '../../src/utils/validator.js';
import { Helper } from '../../src/utils/helper.js';
import util from 'util';

describe("Primitive class", () => {
    describe("constructor", () => {
        test("If obj is passed with all the expected fields, a new object is created.", () => {
            const prim = new Primitive({type:"Double"});
            expect(prim.className).toBe("Primitive");
            expect(prim.type).toBe("Double");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Primitive()).toThrow(ArgumentTypeError);
        });
    });
    describe("list method", () => {
        test("Four predefined objects are listed.", () => {
            const primitives = Primitive.list();
            expect(primitives.length).toBe(4);
        });
    });
});

describe("List class", () => {
    describe("constructor", () => {
        test("If obj is passed with all the expected fields, a new object is created.", () => {
            const prim = new List({element:Primitive.Integer});
            expect(prim.className).toBe("List");
            expect(prim.element.type).toBe("Integer");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new List()).toThrow(ArgumentTypeError);
        });
    });
});

describe("Matrix class", () => {
    describe("constructor", () => {
        test("If obj is passed with all the expected fields, a new object is created.", () => {
            const prim = new Matrix({innerElement:Primitive.Integer});
            expect(prim.className).toBe("Matrix");
            expect(prim.element.className).toBe("List");
            expect(prim.innerElement.type).toBe("Integer");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Matrix()).toThrow(ArgumentTypeError);
        });
    });
});

describe("Map class", () => {
    describe("constructor", () => {
        test("If obj is passed with all the expected fields, a new object is created.", () => {
            const prim = new Map({key:Primitive.String, value:Primitive.Real});
            expect(prim.className).toBe("Map");
            expect(prim.key.type).toBe("String");
            expect(prim.value.type).toBe("Real");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Map()).toThrow(ArgumentTypeError);
        });
    });
});

describe("DataType class", () => {
    describe("reviver method", () => {
        test("Verify Primitive is revived.", () => {
            const original = {data: Primitive.Integer};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify List is revived.", () => {
            const original = {data: new List({element: Primitive.Boolean})};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify Matrix is revived.", () => {
            const original = {data: new Matrix({innerElement: Primitive.String})};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify Map is revived.", () => {
            const original = {data: new Map({key: Primitive.String, value: Primitive.Integer})};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
    });
});