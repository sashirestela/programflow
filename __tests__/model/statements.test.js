import { beforeAll, afterAll, describe, test, expect, jest } from '@jest/globals';
import { Statement, Path, Expression } from '../../src/model/statements.js';
import { Declaration, Assignment, Invocation, Input, Output, Start, Return } from '../../src/model/statements.js';
import { IfElse, Case, For, ForEach, While, DoWhile, Break, Continue, Boundary } from '../../src/model/statements.js';
import { ArgumentTypeError } from '../../src/utils/validator.js';
import { List, Primitive } from '../../src/model/datatypes.js';
import util from 'util';
import crypto from 'crypto';

let uuidMock;
const UUID = "123-456-789";
const objExpression = new Expression("true");

beforeAll(() => {
    uuidMock = jest.spyOn(crypto, "randomUUID");
    uuidMock.mockImplementation(() => UUID);
});

afterAll(() => {
    uuidMock.mockRestore();
});

describe("Statement class", () => {
    describe("parse method", () => {
        test("If a stringified Declaration Statement is parsed, it is recreated successfully.", () => {
            const original = new Declaration({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                variableIdList: [UUID],
                expressionList: [null]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Assignment Statement is parsed, it is recreated successfully.", () => {
            const original = new Assignment({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                variableIdList: [UUID],
                expressionList: [objExpression]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Invocation Statement is parsed, it is recreated successfully.", () => {
            const original = new Invocation({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                expressionList: [objExpression]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Input Statement is parsed, it is recreated successfully.", () => {
            const original = new Input({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                variableIdList: [UUID]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Output Statement is parsed, it is recreated successfully.", () => {
            const original = new Output({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                expressionList: [objExpression]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Start Statement is parsed, it is recreated successfully.", () => {
            const original = new Start({
                surroundScopeId: UUID,
                pathIdList: [UUID]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Return Statement is parsed, it is recreated successfully.", () => {
            const original = new Return({
                surroundScopeId: UUID,
                expression: objExpression
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified IfElse Statement is parsed, it is recreated successfully.", () => {
            const original = new IfElse({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID],
                relatedId: UUID,
                scopeId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Case Statement is parsed, it is recreated successfully.", () => {
            const original = new Case({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID, UUID],
                relatedId: UUID,
                scopeId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified For Statement is parsed, it is recreated successfully.", () => {
            const original = new For({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID],
                relatedId: UUID,
                scopeId: UUID,
                declarationId: UUID,
                assignmentId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified ForEach Statement is parsed, it is recreated successfully.", () => {
            const original = new ForEach({
                surroundScopeId: UUID,
                pathIdList: [UUID, UUID],
                relatedId: UUID,
                scopeId: UUID,
                declarationId: UUID,
                collection: new List({element: Primitive.Integer})
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified While Statement is parsed, it is recreated successfully.", () => {
            const original = new While({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID],
                relatedId: UUID,
                scopeId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified DoWhile Statement is parsed, it is recreated successfully.", () => {
            const original = new DoWhile({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID],
                relatedId: UUID,
                scopeId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Break Statement is parsed, it is recreated successfully.", () => {
            const original = new Break({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Continue Statement is parsed, it is recreated successfully.", () => {
            const original = new Continue({
                surroundScopeId: UUID,
                testExpression: objExpression,
                pathIdList: [UUID, UUID]
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
        test("If a stringified Boundary Statement is parsed, it is recreated successfully.", () => {
            const original = new Boundary({
                surroundScopeId: UUID,
                pathIdList: [UUID],
                relatedId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Statement.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
    });
});

describe("Path class", () => {
    describe("constructor", () => {
        test("If obj is passed with all the expected fields, a new object is created.", () => {
            const object = new Path({
                enabled: Path.DISABLED,
                case: objExpression,
                prevStatementId: UUID,
                nextStatementId: UUID
            });
            expect(object.id).toBe(UUID);
            expect(object.enabled).toBe(Path.DISABLED);
            expect(util.isDeepStrictEqual(object.case, objExpression)).toBe(true);
            expect(object.prevStatementId).toBe(UUID);
            expect(object.nextStatementId).toBe(UUID);
        });
        test("If any expected argument is missed, an Error is raised.", () => {
            expect(() => new Path({prevStatementId: UUID})).toThrow(ArgumentTypeError);
        });
    });
    describe("parse method", () => {
        test("If a stringified Path is parsed, it is recreated successfully.", () => {
            const original = new Path({
                enabled: Path.DISABLED,
                case: objExpression,
                prevStatementId: UUID,
                nextStatementId: UUID
            });
            const originalArray = [original];
            const jsonString = JSON.stringify(originalArray);
            const recreatedArray = Path.parse(jsonString);
            expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true);
        });
    });
});