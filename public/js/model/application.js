import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';
import { ScopeType, Scope, Function } from './symbols.js';
import { Start, Return } from './statements.js';

class Application {
    #_id;
    #_scopeId;

    constructor(name) {
        Validator.checkArgumentType(name, "name", "string");
        this.#_id = Helper.uuid();
        this.name = name;
        this.#_scopeId = undefined;
        this.functionIdList = [];
        this.#init();
    }

    get scopeId() {
        return this.#_scopeId;
    }

    #init() {
        const functionScope = new Scope(ScopeType.Function);
        const returnStatement = new Return("End", functionScope.id, undefined);
        const startStatement = new Start("Main", functionScope.id, returnStatement.id);
        const mainFunction = new Function("main", undefined, undefined, startStatement.id, functionScope.id, Function.IS_MAIN);

        const applicationScope = new Scope(ScopeType.Application);
        this.#_scopeId = applicationScope.id;
        this.functionIdList.push(mainFunction.id);
    }
}

export { Application };