import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';
import { DataType } from './datatypes.js';

class Statement {
    #_id;
    #_className;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        this.#_id = obj.id ?? Helper.uuid();
        this.#_className = obj.className ?? Helper.classFromObject(this);
        this.description = obj.description;
        this.surroundScopeId = obj.surroundScopeId;
        this.comment = undefined;
    }

    static validate(description, surroundScopeId) {
        if (description !== undefined) {
            Validator.checkArgumentType(description, "description", "string")
        }
        Validator.checkArgumentType(surroundScopeId, "surroundScopeId", "string");
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
            description: this.description,
            surroundScopeId: this.surroundScopeId,
            comment: this.comment
        }
    }
}

class Expression {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        this.anExpression = obj.anExpression;
    }

    static create(anExpression) {
        Validator.checkArgumentType(anExpression, "anExpression", "string");
        return new Expression({
            anExpression: anExpression
        });
    }

    toJSON() {
        return {
            anExpression: this.anExpression
        }
    }

    static reviver(k,v) {
        if (k.toLowerCase().endsWith("expression")) {
            return new Expression(v);
        } else {
            return v;
        }
    }
}

class Terminal extends Statement {
    constructor(obj) {
        super(obj);
    }
}

class Start extends Terminal {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.nextStatementId = obj.nextStatementId;
    }

    static create(description, surroundScopeId, nextStatementId) {
        Statement.validate(description, surroundScopeId);
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        return new Start({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                nextStatementId: this.nextStatementId
            }
        }
    }
}

class Return extends Terminal {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.returnExpression = obj.returnExpression;
    }

    static create(description, surroundScopeId, returnExpression) {
        Statement.validate(description, surroundScopeId);
        if (returnExpression !== undefined) {
            Validator.checkArgumentType(returnExpression, "returnExpression", Expression);
        }
        return new Return({
            description: description,
            surroundScopeId: surroundScopeId,
            returnExpression: returnExpression
        })
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                returnExpression: this.returnExpression
            }
        }
    }
}

class Boundary extends Statement {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.nextStatementId = obj.nextStatementId;
    }

    static create(description, surroundScopeId, nextStatementId) {
        Statement.validate(description, surroundScopeId);
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        return new Boundary({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                nextStatementId: this.nextStatementId
            }
        }
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