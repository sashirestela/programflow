import {Helper} from './../utils/helper.js';
import {Validator} from './../utils/errors.js';
import {DataType} from './datatypes.js';

class Statement {
    #_id;
    #_className;

    constructor(description, comment, idSurroundScope) {
        if (description !== undefined) {
            Validator.checkArgumentType(description, "description", "string")
        }
        if (comment !== undefined) {
            Validator.checkArgumentType(comment, "comment", "string");
        }
        Validator.checkArgumentType(idSurroundScope, "idSurroundScope", "string");
        this.#_id = Helper.uuid();
        this.#_className = Helper.classFromObject(this);
        this.description = description;
        this.comment = comment;
        this.idSurroundScope = idSurroundScope;
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

    constructor(theExpression) {
        Validator.checkArgumentType(theExpression, "theExpression", "string");
        this.#_id = Helper.uuid();
        this.theExpression = theExpression;
    }

    get id() {
        return this.#_id;
    }
}

class Terminal extends Statement {
    constructor(description, comment, idSurroundScope) {
        super(description, comment, idSurroundScope);
    }
}

class Start extends Terminal {
    constructor(description, comment, idSurroundScope, idNext) {
        Validator.checkArgumentType(idNext, "idNext", "string");
        super(description, comment, idSurroundScope);
        this.idNext = idNext;
    }
}

class Return extends Terminal {
    constructor(description, comment, idSurroundScope, returnExpression) {
        if (returnExpression !== undefined) {
            Validator.checkArgumentType(returnExpression, "returnExpression", Expression);
        }
        super(description, comment, idSurroundScope);
        this.returnExpression = returnExpression;
    }
}

export {Statement, Expression, Terminal, Start, Return}