import { Validator } from './../utils/errors.js';
import { DataType } from './datatypes.js';
import { Statement, Expression } from './statements.js';

class Single extends Statement {
    constructor(description, surroundScopeId, nextStatementId) {
        Validator.checkArgumentType(nextStatementId, "nextStatementId", "string");
        super(description, surroundScopeId);
        this.nextStatementId = nextStatementId;
    }
}

class Declaration extends Single {
    #_variableId;

    constructor(description, surroundScopeId, nextStatementId, variableId, initialize) {
        Validator.checkArgumentType(variableId, "variableId", "string");
        if (initialize !== undefined) {
            Validator.checkArgumentType(initialize, "initialize", Expression);
        }
        super(description, surroundScopeId, nextStatementId);
        this.#_variableId = variableId;
        this.initialize = initialize;
    }

    get variableId() {
        return this.#_variableId;
    }
}

class Assignment extends Single {
    constructor(description, surroundScopeId, nextStatementId, variableId, assignValue) {
        Validator.checkArgumentType(variableId, "variableId", "string");
        Validator.checkArgumentType(assignValue, "assignValue", Expression);
        super(description, surroundScopeId, nextStatementId);
        this.variableId = variableId;
        this.assignValue = assignValue;
    }
}

class Invocation extends Single {
    constructor(description, surroundScopeId, nextStatementId, call) {
        Validator.checkArgumentType(call, "call", Expression);
        super(description, surroundScopeId, nextStatementId);
        this.call = call;
    }
}

class Interaction extends Single {
    constructor(description, surroundScopeId, nextStatementId) {
        super(description, surroundScopeId, nextStatementId);
    }
}

class Input extends Interaction {
    constructor(description, surroundScopeId, nextStatementId, variableId) {
        Validator.checkArgumentType(variableId, "variableId", "string");
        super(description, surroundScopeId, nextStatementId);
        this.variableId = variableId;
    }
}

class Output extends Interaction {
    constructor(description, surroundScopeId, nextStatementId, outExpression) {
        Validator.checkArgumentType(outExpression, "outExpression", Expression);
        super(description, surroundScopeId, nextStatementId);
        this.outExpression = outExpression;
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