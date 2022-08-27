import { beforeAll, afterAll, describe, test, expect, jest } from '@jest/globals';
import { Primitive } from '../../src/model/datatypes.js';
import { Variable, Function, ScopeType, Scope } from '../../src/model/symbols.js';
import { ArgumentTypeError } from '../../src/utils/errors.js';
import util from 'util';
import crypto from 'crypto';

let uuidMock;
const UUID = "123-456-789";

beforeAll(() => {
    uuidMock = jest.spyOn(crypto, "randomUUID");
    uuidMock.mockImplementation(() => UUID);
});

afterAll(() => {
    uuidMock.mockRestore();
});

describe("Variable class", () => {
    describe("create method", () => {
        test("If all the expected arguments are passed a new object is created.", () => {
            const object = Variable.create("firstName", Primitive.String);
            expect(object.id).toBe(UUID);
            expect(object.className).toBe("Variable");
            expect(object.name).toBe("firstName");
            expect(util.isDeepStrictEqual(object.dataType, Primitive.String)).toBe(true);
        });
        test("If any expected argument is missed, an Error is raised.", () => {
            expect(() => Variable.create("firstName")).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const object = Variable.create("age", Primitive.Integer);
            const result = JSON.stringify(object);
            const expected = `{"id":"${UUID}","className":"Variable","name":"age","dataType":{"className":"Primitive","type":"Integer"}}`;
            expect(result).toBe(expected);
        });
    });
});

describe("Function class", () => {
    describe("create method", () => {
        test("If all the expected arguments are passed a new object is created.", () => {
            const object = Function.create("add", Primitive.Real, [UUID, UUID, UUID], UUID, UUID, Function.IS_MAIN);
            expect(object.id).toBe(UUID);
            expect(object.className).toBe("Function");
            expect(object.name).toBe("add");
            expect(util.isDeepStrictEqual(object.dataType, Primitive.Real)).toBe(true);
            expect(object.paramIdList.length).toBe(3);
            expect(object.startStatementId).toBe(UUID);
            expect(object.scopeId).toBe(UUID);
            expect(object.isMain).toBe(true);
        });
        test("If any expected argument is missed, an Error is raised.", () => {
            expect(() => Function.create("add", Primitive.Real, [UUID, UUID, UUID])).toThrow(ArgumentTypeError);
        });
    });
    describe("createXxx methods", () => {
        test("If dataType is not provided, a new object is still created.", () => {
            const object = Function.createNoReturn("process", [UUID, UUID, UUID], UUID, UUID);
            expect(object.id).toBe(UUID);
            expect(object.className).toBe("Function");
            expect(object.name).toBe("process");
            expect(object.dataType).toBeUndefined();
            expect(object.paramIdList.length).toBe(3);
            expect(object.startStatementId).toBe(UUID);
            expect(object.scopeId).toBe(UUID);
            expect(object.isMain).toBe(false);
        });
        test("If paramIdList is not provided, a new object is still created.", () => {
            const object = Function.createNoParams("process", Primitive.Real, UUID, UUID);
            expect(object.id).toBe(UUID);
            expect(object.className).toBe("Function");
            expect(object.name).toBe("process");
            expect(util.isDeepStrictEqual(object.dataType, Primitive.Real)).toBe(true);
            expect(object.paramIdList).toBeUndefined();
            expect(object.startStatementId).toBe(UUID);
            expect(object.scopeId).toBe(UUID);
            expect(object.isMain).toBe(false);
        });
        test("If dataType and paramIdList are not provided, a new object is still created.", () => {
            const object = Function.createNoReturnAndNoParams("process", UUID, UUID);
            expect(object.id).toBe(UUID);
            expect(object.className).toBe("Function");
            expect(object.name).toBe("process");
            expect(object.dataType).toBeUndefined();
            expect(object.paramIdList).toBeUndefined();
            expect(object.startStatementId).toBe(UUID);
            expect(object.scopeId).toBe(UUID);
            expect(object.isMain).toBe(false);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const object = Function.create("add", Primitive.Real, [UUID, UUID, UUID], UUID, UUID);
            const result = JSON.stringify(object);
            const expected = `{"id":"${UUID}","className":"Function","name":"add","dataType":{"className":"Primitive","type":"Real"},` +
                `"paramIdList":["${UUID}","${UUID}","${UUID}"],"startStatementId":"${UUID}","scopeId":"${UUID}","isMain":false}`;
            expect(result).toBe(expected);
        });
    });
});

describe("ScopeType class", () => {
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const object = new ScopeType("Module");
            const result = JSON.stringify(object);
            expect(result).toBe('{"type":"Module"}');
        });
    });
    describe("list method", () => {
        test("Four predefined objects are listed.", () => {
            const scopes = ScopeType.list();
            expect(scopes.length).toBe(4);
        });
    });
    describe("reviver method", () => {
        test("Verify ScopeType.", () => {
            const original = {scopeType: ScopeType.CompoundLoop};
            const str = JSON.stringify(original);
            const parsed = JSON.parse(str, (k,v) => ScopeType.reviver(k,v));
            expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true);
        });
    });
});

describe("Scope class", () => {
    describe("new operator", () => {
        test("If obj argument is passed, a new object is created.", () => {
            const object = new Scope({scopeType:ScopeType.Function, parentScopeId:UUID});
            expect(object.id).toBe(UUID);
            expect(object.scopeType.type).toBe("Function");
            expect(object.parentScopeId).toBe(UUID);
        });
        test("If obj argument isn't passed, an Error is raised.", () => {
            expect(() => new Scope()).toThrow(ArgumentTypeError);
        });
    });
    describe("create method", () => {
        test("If all the expected arguments are passed a new object is created.", () => {
            const object = Scope.create(ScopeType.Application);
            expect(object.id).toBe(UUID);
            expect(object.scopeType.type).toBe("Application");
            expect(object.parentScopeId).toBeUndefined();
        });
        test("If any expected argument is missed, an Error is raised.", () => {
            expect(() => Scope.create()).toThrow(ArgumentTypeError);
        });
    });
    describe("toJSON method", () => {
        test("If an object is stringified, all its properties are shown.", () => {
            const object = Scope.create(ScopeType.Function, UUID);
            const result = JSON.stringify(object);
            const expected = `{"id":"${UUID}","scopeType":{"type":"Function"},"parentScopeId":"${UUID}","symbolMap":{}}`;
            expect(result).toBe(expected);
        });
    });
});