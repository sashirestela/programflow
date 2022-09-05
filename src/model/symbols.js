import { Helper } from './../utils/helper.js';
import { Validator, Cardinality } from './../utils/validator.js';
import { DataType } from './datatypes.js';

class Symbol {
    id = Helper.uuid();
    className = Helper.classFromObject(this);
    name = null;
    dataType = null;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        Validator.checkArgumentType(obj.name, "obj.name", "string");
        Validator.checkArgumentTypeIfExists(obj.dataType, "obj.dataType", DataType);
        Object.assign(this, obj);
    }

    static reviver(k,v) {
        switch (v.className) {
            case "Variable":
                return new Variable(v);
            case "Function":
                return new Function(v);
            default:
                return v;
        }
    }

    static parse(jsonString) {
        return JSON.parse(jsonString, Helper.pipeRevivers(
            DataType.reviver, Symbol.reviver));
    }
}

class Variable extends Symbol {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.dataType, "obj.dataType", Cardinality.One);
    }
}

class Function extends Symbol {
    paramIdList = [];
    startStatementId = null;
    scopeId = null;
    isMain = false;

    constructor(obj) {
        super(obj);
        Validator.checkArgumentTypeIfExists(obj.paramIdList, "obj.paramIdList", "string", Validator.ARRAY);
        Validator.checkArgumentType(obj.startStatementId, "obj.startStatementId", "string");
        Validator.checkArgumentType(obj.scopeId, "obj.scopeId", "string");
        Validator.checkArgumentTypeIfExists(obj.isMain, "obj.isMain", "boolean");
        Object.assign(this, obj);
    }

    static get MAIN() {
        return true;
    }
}

class Scope {
    id = Helper.uuid();
    scopeType = null;
    parentScopeId = null;
    symbolMap = {};

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        Validator.checkArgumentType(obj.scopeType, "obj.scopeType", ScopeType);
        Validator.checkArgumentTypeIfExists(obj.parentScopeId, "obj.parentScopeId", "string");
        Object.assign(this, obj);
    }

    static reviver(k,v) {
        return (v !== null && v.scopeType !== undefined ? new Scope(v) : v);
    }

    static parse(jsonString) {
        return JSON.parse(jsonString, Helper.pipeRevivers(
            ScopeType.reviver, Scope.reviver));
    }
}

class ScopeType {
    type;

    constructor(type) {
        this.type = type;
    }

    static reviver(k,v) {
        return (k === "scopeType" ? new ScopeType(v.type) : v);
    }

    static list() {
        return Object.values(ScopeType);
    }

    static Application = new ScopeType("Application");
    static Function = new ScopeType("Function");
    static CompoundLoop = new ScopeType("CompoundLoop");
    static CompoundFork = new ScopeType("CompoundFork");
}

export {
    Symbol,
    Variable,
    Function,
    Scope,
    ScopeType
}