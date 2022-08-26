import { DataType, Primitive, List, Matrix, Map } from '../../public/js/model/datatypes.js';
import { ArgumentTypeError } from '../../public/js/utils/errors.js';

describe("Primitive class", () => {
    describe("constructor operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Primitive({type:"Double"});
            expect(prim).toBeDefined();
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Primitive()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If type argument is passed, a new object is created.", () => {
            const prim = Primitive.create("Double");
            expect(prim).toBeDefined();
        });
        test("If type argument isn't passed, an Error is raised.", () => {
            expect(() => Primitive.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all the fields are shown.", () => {
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
    describe("constructor operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new List({element:Primitive.Integer});
            expect(prim).toBeDefined();
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new List()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If type argument is passed, a new object is created.", () => {
            const prim = List.create(Primitive.Integer);
            expect(prim).toBeDefined();
        });
        test("If type argument isn't passed, an Error is raised.", () => {
            expect(() => List.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all the fields are shown.", () => {
            const prim = List.create(Primitive.Integer);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"List","element":{"className":"Primitive","type":"Integer"}}');
        });
    });
});

describe("Matrix class", () => {
    describe("constructor operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Matrix({element:Primitive.Integer});
            expect(prim).toBeDefined();
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Matrix()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If type argument is passed, a new object is created.", () => {
            const prim = Matrix.create(Primitive.Integer);
            expect(prim).toBeDefined();
        });
        test("If type argument isn't passed, an Error is raised.", () => {
            expect(() => Matrix.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all the fields are shown.", () => {
            const prim = Matrix.create(Primitive.Integer);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"Matrix","element":{"className":"List","element":{"className":"Primitive","type":"Integer"}},"innerElement":{"className":"Primitive","type":"Integer"}}');
        });
    });
});

describe("Map class", () => {
    describe("constructor operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const prim = new Map({key:Primitive.String, value:Primitive.Real});
            expect(prim).toBeDefined();
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Map()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If type argument is passed, a new object is created.", () => {
            const prim = Map.create(Primitive.String, Primitive.Real);
            expect(prim).toBeDefined();
        });
        test("If type argument isn't passed, an Error is raised.", () => {
            expect(() => Map.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all the fields are shown.", () => {
            const prim = Map.create(Primitive.String, Primitive.Real);
            const result = JSON.stringify(prim);
            expect(result).toBe('{"className":"Map","key":{"className":"Primitive","type":"String"},"value":{"className":"Primitive","type":"Real"}}');
        });
    });
});

describe("DataType class", () => {
    describe("reviver method", () => {
        test("Verify Primitive.", () => {
            const original = Primitive.create("Double");
            const str = JSON.stringify(original);
            console.log(str);
            const json = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            console.log(json);
            const parsed = new Primitive(json);
            expect(parsed).toBe(original);
        });
        test("Verify List.", () => {
            const original = List.create(Primitive.Boolean)
            const str = JSON.stringify(original);
            console.log(str);
            const json = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            console.log(json);
            const parsed = new List(json);
            expect(parsed).toBe(original);
        });
        test("Verify Matrix.", () => {
            const original = Matrix.create(Primitive.String)
            const str = JSON.stringify(original);
            console.log(str);
            const json = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            console.log(json);
            const parsed = new Matrix(json);
            expect(parsed).toBe(original);
        });
        test("Verify Map.", () => {
            const original = Map.create(Primitive.String, Primitive.Integer);
            const str = JSON.stringify(original);
            console.log(str);
            const json = JSON.parse(str, (k,v) => DataType.reviver(k,v));
            console.log(json);
            const parsed = new Map(json);
            expect(parsed).toBe(original);
        });
    });
});