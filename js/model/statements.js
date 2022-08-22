import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';
import { DataType } from './datatypes.js';

class Statement {
    #_id;
    #_className;

    constructor(description, surroundScopeId) {
        if (description !== undefined) {
            Validator.checkArgumentType(description, "description", "string")
        }
        Validator.checkArgumentType(surroundScopeId, "surroundScopeId", "string");
        this.#_id = Helper.uuid();
        this.#_className = Helper.classFromObject(this);
        this.description = description;
        this.surroundScopeId = surroundScopeId;
        this.comment = undefined;
    }

    get id() {
        return this.#_id;
    }

    get className() {
        return this.#_className;
    }
}

class Expression {
    constructor(anExpression) {
        Validator.checkArgumentType(anExpression, "anExpression", "string");
        this.anExpression = anExpression;
    }
}

class Terminal extends Statement {
    constructor(description, surroundScopeId) {
        super(description, surroundScopeId);
    }
}

class Start extends Terminal {
    constructor(description, surroundScopeId, nextStatementId) {
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        super(description, surroundScopeId);
        this.nextStatementId = nextStatementId;
    }
}

class Return extends Terminal {
    constructor(description, surroundScopeId, returnExpression) {
        if (returnExpression !== undefined) {
            Validator.checkArgumentType(returnExpression, "returnExpression", Expression);
        }
        super(description, surroundScopeId);
        this.returnExpression = returnExpression;
    }
}

class Boundary extends Statement {
    constructor(description, surroundScopeId, nextStatementId) {
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        super(description, surroundScopeId);
        this.nextStatementId = nextStatementId;
    }
}

export {
    Statement,
    Expression,
    Terminal,
    Start,
    Return,
    Boundary,
}