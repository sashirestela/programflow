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
        const applicationScope = Scope.create(ScopeType.Application);
        const functionScope = Scope.create(ScopeType.Function, applicationScope.id);
        const returnStatement = Return.create("End", functionScope.id, undefined);
        const startStatement = Start.create("Main", functionScope.id, returnStatement.id);
        const mainFunction = Function.createNoReturnAndNoParams("main", startStatement.id, functionScope.id, Function.IS_MAIN);

        this.#_scopeId = applicationScope.id;
        this.functionIdList.push(mainFunction.id);
    }
}

export { Application };