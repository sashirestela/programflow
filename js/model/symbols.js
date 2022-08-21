import {Helper} from './../utils/helper.js';
import {Validator} from './../utils/errors.js';
import {DataType} from './datatypes.js';

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
    #_idStart;
    #_idScope;
    #_isMain;

    constructor(name, dataType, idParamList, idStart, idScope, isMain=false) {
        if (dataType !== undefined) {
            Validator.checkArgumentType(dataType, "dataType", DataType);
        }
        if (idParamList !== undefined) {
            Validator.checkArgumentType(idParamList, "idParamList", "string", Validator.ARGUMENT_IS_ARRAY);
        }
        Validator.checkArgumentType(idStart, "idStart", "string");
        Validator.checkArgumentType(idScope, "idScope", "string");
        Validator.checkArgumentType(isMain, "isMain", "boolean");
        super(name, dataType);
        this.idParamList = idParamList
        this.#_idStart = idStart;
        this.#_idScope = idScope;
        this.#_isMain = isMain;
    }

    get idStart() {
        return this.#_idStart;
    }

    get idScope() {
        return this.#_idScope;
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
    static Compound = new ScopeType("Compound");
}

class Scope {
    #_id;
    #_scopeType;
    #_idParentScope;

    constructor(scopeType, idParentScope) {
        Validator.checkArgumentType(scopeType, "scopeType", ScopeType);
        if (idParentScope !== undefined) {
            Validator.checkArgumentType(idParentScope, "idParentScope", "string");
        }
        this.#_id = Helper.uuid();
        this.#_scopeType = scopeType;
        this.#_idParentScope = idParentScope;
        this.symbolMap = {};
    }

    get id() {
        return this.#_id;
    }

    get scopeType() {
        return this.#_scopeType;
    }

    get idParentScope() {
        return this.#_idParentScope;
    }
}

export {Symbol, Variable, Function, ScopeType, Scope};