import {Helper} from './../utils/helper.js';
import {Validator} from './../utils/errors.js';
import {ScopeType, Scope} from './symbols.js';
import {Start, Return} from './statements.js';

class Application {
    #_id;

    constructor(name) {
        Validator.checkArgumentType(name, "name", "string");
        this.#_id = Helper.uuid();
        this.name = name;
        this.scope = undefined;
        this.idFunctionList = [];
        this.#init();
    }

    #init() {
        const functionScope = new Scope(ScopeType.Function);
        const returnStatement = new Return(undefined, undefined, functionScope.id, undefined);
        const startStatement = new Start(undefined, undefined, functionScope.id, returnStatement.id);
        const mainFunction = new Function("main", undefined, undefined, startStatement.id, functionScope.id, Function.IS_MAIN);

        const applicationScope = new Scope(ScopeType.Application);
        this.scope = applicationScope.id;
        this.idFunctionList.push(mainFunction.id);
    }
}