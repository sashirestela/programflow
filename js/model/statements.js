import {Helper} from './../utils/helper.js';
import {Validator} from './../utils/errors.js';
import {DataType} from './datatypes.js';

class Statement {
    #_id;
    #_className;

    constructor(description, comment, surroundScopeId) {
        if (description !== undefined) {
            Validator.checkArgumentType(description, "description", "string")
        }
        if (comment !== undefined) {
            Validator.checkArgumentType(comment, "comment", "string");
        }
        Validator.checkArgumentType(surroundScopeId, "surroundScopeId", "string");
        this.#_id = Helper.uuid();
        this.#_className = Helper.classFromObject(this);
        this.description = description;
        this.comment = comment;
        this.surroundScopeId = surroundScopeId;
    }

    get id() {
        return this.#_id;
    }

    get className() {
        return this.#_className;
    }
}

class Expression {
    #_id;

    constructor(theExpression, symbolIdList) {
        Validator.checkArgumentType(theExpression, "theExpression", "string");
        if (symbolIdList !== undefined) {
            Validator.checkArgumentType(symbolIdList, "symbolIdList", "string", Validator.ARGUMENT_IS_ARRAY);
        }
        this.#_id = Helper.uuid();
        this.theExpression = theExpression;
        this.symbolIdList = symbolIdList;
    }

    get id() {
        return this.#_id;
    }
}

class Terminal extends Statement {
    constructor(description, comment, surroundScopeId) {
        super(description, comment, surroundScopeId);
    }
}

class Start extends Terminal {
    constructor(description, comment, surroundScopeId, idNext) {
        Validator.checkArgumentType(idNext, "idNext", "string");
        super(description, comment, surroundScopeId);
        this.idNext = idNext;
    }
}

class Return extends Terminal {
    constructor(description, comment, surroundScopeId, returnExpression) {
        if (returnExpression !== undefined) {
            Validator.checkArgumentType(returnExpression, "returnExpression", Expression);
        }
        super(description, comment, surroundScopeId);
        this.returnExpression = returnExpression;
    }
}

export {Statement, Expression, Terminal, Start, Return}