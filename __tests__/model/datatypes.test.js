import { describe, test, expect } from '@jest/globals';
import { DataType, Primitive, List, Matrix, Map } from '../../src/model/datatypes.js';
import { ArgumentTypeError } from '../../src/utils/errors.js';
import util from 'util';

describe("Primitive class", () => {
    describe("new operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Primitive({type:"Double"});
            expect(prim.className).toBe("Primitive");
            expect(prim.type).toBe("Double");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Primitive()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If type argument is passed, a new object is created.", () => {
            const prim = Primitive.create("Double");
            expect(prim.className).toBe("Primitive");
            expect(prim.type).toBe("Double");
        });
        test("If type argument isn't passed, an Error is raised.", () => {
            expect(() => Primitive.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const prim = Primitive.create("Double");
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"Primitive","type":"Double"}');
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
    describe("new operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new List({element:Primitive.Integer});
            expect(prim.className).toBe("List");
            expect(prim.element.type).toBe("Integer");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new List()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If element argument is passed, a new object is created.", () => {
            const prim = List.create(Primitive.Integer);
            expect(prim.className).toBe("List");
            expect(prim.element.type).toBe("Integer");
        });
        test("If element argument isn't passed, an Error is raised.", () => {
            expect(() => List.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const prim = List.create(Primitive.Integer);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"List","element":{"className":"Primitive","type":"Integer"}}');
        });
    });
});

describe("Matrix class", () => {
    describe("new operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Matrix({element:Primitive.Integer});
            expect(prim.className).toBe("Matrix");
            expect(prim.innerElement.type).toBe("Integer");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Matrix()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If element argument is passed, a new object is created.", () => {
            const prim = Matrix.create(Primitive.Integer);
            expect(prim.className).toBe("Matrix");
            expect(prim.innerElement.type).toBe("Integer");
        });
        test("If element argument isn't passed, an Error is raised.", () => {
            expect(() => Matrix.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const prim = Matrix.create(Primitive.Integer);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"Matrix","element":{"className":"List","element":{"className":"Primitive","type":"Integer"}},"innerElement":{"className":"Primitive","type":"Integer"}}');
        });
    });
});

describe("Map class", () => {
    describe("new operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Map({key:Primitive.String, value:Primitive.Real});
            expect(prim.className).toBe("Map");
            expect(prim.key.type).toBe("String");
            expect(prim.value.type).toBe("Real");
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Map()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If key and value arguments are passed, a new object is created.", () => {
            const prim = Map.create(Primitive.String, Primitive.Real);
            expect(prim.className).toBe("Map");
            expect(prim.key.type).toBe("String");
            expect(prim.value.type).toBe("Real");
        });
        test("If key and value arguments aren't passed, an Error is raised.", () => {
            expect(() => Map.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const prim = Map.create(Primitive.String, Primitive.Real);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"Map","key":{"className":"Primitive","type":"String"},"value":{"className":"Primitive","type":"Real"}}');
        });
    });
});

describe("DataType class", () => {
    describe("reviver method", () => {
        test("Verify Primitive.", () => {
            const original = {data: Primitive.Integer};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify List.", () => {
            const original = {data: List.create(Primitive.Boolean)};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify Matrix.", () => {
            const original = {data: Matrix.create(Primitive.String)};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
        test("Verify Map.", () => {
            const original = {data: Map.create(Primitive.String, Primitive.Integer)};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
    });
});