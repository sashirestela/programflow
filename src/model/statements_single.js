import { Validator } from './../utils/errors.js';
import { Statement, Expression } from './statements.js';

class Single extends Statement {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.nextStatementId = obj.nextStatementId;
    }

    static validate(description, surroundScopeId, nextStatementId) {
        Statement.validate(description, surroundScopeId);
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
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

class Declaration extends Single {
    #_variableId;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.#_variableId = obj.variableId;
        this.initialize = obj.initialize;
    }

    static create(description, surroundScopeId, nextStatementId, variableId, initialize) {
        Single.validate(description, surroundScopeId, nextStatementId);
        Validator.checkArgumentType(variableId, "variableId", "string");
        if (initialize !== undefined) {
            Validator.checkArgumentType(initialize, "initialize", Expression);
        }
        return new Declaration({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId,
            variableId: variableId,
            initialize: initialize
        })
    }

    get variableId() {
        return this.#_variableId;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                variableId: this.#_variableId,
                initialize: this.initialize
            }
        }
    }
}

class Assignment extends Single {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.variableId = obj.variableId;
        this.assignValue = obj.assignValue;
    }

    static create(description, surroundScopeId, nextStatementId, variableId, assignValue) {
        Single.validate(description, surroundScopeId, nextStatementId);
        Validator.checkArgumentType(variableId, "variableId", "string");
        Validator.checkArgumentType(assignValue, "assignValue", Expression);
        return new Assignment({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId,
            variableId: variableId,
            assignValue: assignValue
        })
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                variableId: this.variableId,
                assignValue: this.assignValue
            }
        }
    }
}

class Invocation extends Single {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.call = obj.call;
    }

    static create(description, surroundScopeId, nextStatementId, call) {
        Single.validate(description, surroundScopeId, nextStatementId);
        Validator.checkArgumentType(call, "call", Expression);
        return new Invocation({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId,
            call: call
        })
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                call: this.call
            }
        }
    }
}

class Interaction extends Single {
    constructor(obj) {
        super(obj);
    }
}

class Input extends Interaction {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.variableId = obj.variableId;
    }

    static create(description, surroundScopeId, nextStatementId, variableId) {
        Single.validate(description, surroundScopeId, nextStatementId);
        Validator.checkArgumentType(variableId, "variableId", "string");
        return new Input({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId,
            variableId: variableId
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                variableId: this.variableId
            }
        }
    }
}

class Output extends Interaction {
    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.outExpression = obj.outExpression;
    }

    static create(description, surroundScopeId, nextStatementId, outExpression) {
        Single.validate(description, surroundScopeId, nextStatementId);
        Validator.checkArgumentType(outExpression, "outExpression", Expression);
        return new Output({
            description: description,
            surroundScopeId: surroundScopeId,
            nextStatementId: nextStatementId,
            outExpression: outExpression
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                outExpression: this.outExpression
            }
        }
    }
}

class Jump extends Statement {
    constructor(description, surroundScopeId, condition, nextStatementId) {
        Validator.checkArgumentType(condition, "condition", Expression);
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        super(description, surroundScopeId);
        this.condition = condition;
        this.nextStatementId = nextStatementId;
    }
}

class Break extends Jump {
    constructor(description, surroundScopeId, condition, nextStatementId) {
        super(description, surroundScopeId, condition, nextStatementId);
    }
}

class Continue extends Jump {
    constructor(description, surroundScopeId, condition, nextStatementId) {
        super(description, surroundScopeId, condition, nextStatementId);
    }
}

export {
    Single,
    Declaration,
    Assignment,
    Invocation,
    Interaction,
    Input,
    Output,
    Jump,
    Break,
    Continue,
}