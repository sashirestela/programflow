import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';
import { DataType } from './datatypes.js';

class Symbol {
    #_id;
    #_className;

    constructor(name, dataType) {
        Validator.checkArgumentType(name, "name", "string");
        this.#_id = Helper.uuid();
        this.#_className = Helper.classFromObject(this);
        this.name = name;
        this.dataType = dataType;
    }

    get id() {
        return this.#_id;
    }

    get className() {
        return this.#_className;
    }
}

class Variable extends Symbol {
    constructor(name, dataType) {
        Validator.checkArgumentType(dataType, "dataType", DataType);
        super(name, dataType);
    }
}

class Function extends Symbol {
    #_startStatementId;
    #_scopeId;
    #_isMain;

    constructor(name, dataType, paramIdList, startStatementId, scopeId, isMain = false) {
        if (dataType !== undefined) {
            Validator.checkArgumentType(dataType, "dataType", DataType);
        }
        if (paramIdList !== undefined) {
            Validator.checkArgumentType(paramIdList, "paramIdList", "string", Validator.ARGUMENT_IS_ARRAY);
        }
        Validator.checkArgumentType(startStatementId, "startStatementId", "string");
        Validator.checkArgumentType(scopeId, "scopeId", "string");
        Validator.checkArgumentType(isMain, "isMain", "boolean");
        super(name, dataType);
        this.paramIdList = paramIdList
        this.#_startStatementId = startStatementId;
        this.#_scopeId = scopeId;
        this.#_isMain = isMain;
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

    constructor(scopeType, parentScopeId) {
        Validator.checkArgumentType(scopeType, "scopeType", ScopeType);
        if (parentScopeId !== undefined) {
            Validator.checkArgumentType(parentScopeId, "parentScopeId", "string");
        }
        this.#_id = Helper.uuid();
        this.#_scopeType = scopeType;
        this.#_parentScopeId = parentScopeId;
        this.symbolMap = {};
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
}

export {
    Symbol,
    Variable,
    Function,
    ScopeType,
    Scope,
};