import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';
import { DataType } from './datatypes.js';

class Symbol {
    #_id;
    #_className;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        this.#_id = obj.id ?? Helper.uuid();
        this.#_className = obj.className ?? Helper.classFromObject(this);
        this.name = obj.name;
    }

    get id() {
        return this.#_id;
    }

    get className() {
        return this.#_className;
    }

    toJSON() {
        return {
            id: this.#_id,
            className: this.#_className,
            name: this.name
        }
    }
}

class Variable extends Symbol {
    constructor(obj) {
        super(obj);
        this.dataType = obj.dataType;
    }

    static create(name, dataType) {
        Validator.checkArgumentType(name, "name", "string");
        Validator.checkArgumentType(dataType, "dataType", DataType);
        return new Variable({
            name: name,
            dataType: dataType
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            dataType: this.dataType
        }
    }
}

class Function extends Symbol {
    #_startStatementId;
    #_scopeId;
    #_isMain;

    constructor(obj) {
        super(obj);
        this.dataType = obj.dataType;
        this.paramIdList = obj.paramIdList
        this.#_startStatementId = obj.startStatementId;
        this.#_scopeId = obj.scopeId;
        this.#_isMain = obj.isMain;
    }

    static create(name, dataType, paramIdList, startStatementId, scopeId, isMain = false) {
        Validator.checkArgumentType(name, "name", "string");
        if (dataType !== undefined) {
            Validator.checkArgumentType(dataType, "dataType", DataType);
        }
        if (paramIdList !== undefined) {
            Validator.checkArgumentType(paramIdList, "paramIdList", "string", Validator.ARGUMENT_IS_ARRAY);
        }
        Validator.checkArgumentType(startStatementId, "startStatementId", "string");
        Validator.checkArgumentType(scopeId, "scopeId", "string");
        Validator.checkArgumentType(isMain, "isMain", "boolean");
        return new Function({
            name: name,
            dataType: dataType,
            paramIdList: paramIdList,
            startStatementId: startStatementId,
            scopeId: scopeId,
            isMain: isMain
        });
    }

    static createNoReturn(name, paramIdList, startStatementId, scopeId, isMain = false) {
        return Function.create(name, undefined, paramIdList, startStatementId, scopeId, isMain);
    }

    static createNoParams(name, dataType, startStatementId, scopeId, isMain = false) {
        return Function.create(name, dataType, undefined, startStatementId, scopeId, isMain);
    }

    static createNoReturnAndNoParams(name, startStatementId, scopeId, isMain = false) {
        return Function.create(name, undefined, undefined, startStatementId, scopeId, isMain);
    }

    get startStatementId() {
        return this.#_startStatementId;
    }

    get scopeId() {
        return this.#_scopeId;
    }

    get isMain() {
        return this.#_isMain;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            dataType: this.dataType,
            paramIdList: this.paramIdList,
            startStatementId: this.#_startStatementId,
            scopeId: this.#_scopeId,
            isMain: this.#_isMain
        }
    }

    static get IS_MAIN() {
        return true;
    }
}

class ScopeType {
    #_type;

    constructor(type) {
        this.#_type = type;
    }

    get type() {
        return this.#_type;
    }

    toJSON() {
        return {
            type: this.#_type
        }
    }

    static reviver(k,v) {
        if (k === "scopeType") {
            return new ScopeType(v.type);
        } else {
            return v;
        }
    }

    static list() {
        return Object.values(ScopeType);
    }

    static Application = new ScopeType("Application");
    static Function = new ScopeType("Function");
    static CompoundLoop = new ScopeType("CompoundLoop");
    static CompoundFork = new ScopeType("CompoundFork");
}

class Scope {
    #_id;
    #_scopeType;
    #_parentScopeId;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        this.#_id = obj.id ?? Helper.uuid();
        this.#_scopeType = obj.scopeType;
        this.#_parentScopeId = obj.parentScopeId;
        this.symbolMap = {};
    }

    static create(scopeType, parentScopeId) {
        Validator.checkArgumentType(scopeType, "scopeType", ScopeType);
        if (parentScopeId !== undefined) {
            Validator.checkArgumentType(parentScopeId, "parentScopeId", "string");
        }
        return new Scope({
            scopeType: scopeType,
            parentScopeId: parentScopeId
        });
    }

    get id() {
        return this.#_id;
    }

    get scopeType() {
        return this.#_scopeType;
    }

    get parentScopeId() {
        return this.#_parentScopeId;
    }

    toJSON() {
        return {
            id: this.#_id,
            scopeType: this.#_scopeType,
            parentScopeId: this.#_parentScopeId,
            symbolMap: this.symbolMap
        }
    }
}

export {
    Symbol,
    Variable,
    Function,
    ScopeType,
    Scope,
};