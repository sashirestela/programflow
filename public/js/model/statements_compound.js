import { Validator } from './../utils/errors.js';
import { DataType, List } from './datatypes.js';
import { Statement, Expression } from './statements.js';

class Compound extends Statement {
    #_auxiliaryId;
    #_scopeId;

    constructor(description, surroundScopeId, auxiliaryId, scopeId) {
        Validator.checkArgumentType(auxiliaryId, "auxiliaryId", "string");
        Validator.checkArgumentType(scopeId, "scopeId", "string");
        super(description, surroundScopeId);
        this.#_auxiliaryId = auxiliaryId;
        this.#_scopeId = scopeId;
    }

    get auxiliaryId() {
        return this.#_auxiliaryId;
    }

    get scopeId() {
        return this.#_scopeId;
    }
}

class Fork extends Compound {
    constructor(description, surroundScopeId, auxiliaryId, scopeId) {
        super(description, surroundScopeId, auxiliaryId, scopeId);
    }
}

class IfElse extends Fork {
    constructor(description, surroundScopeId, auxiliaryId, scopeId,
        condition, nextTrueStatementId, nextFalseStatementId) {
        Validator.checkArgumentType(condition, "condition", Expression);
        Validator.checkArgumentType(nextTrueStatementId, "nextTrueStatementId", "string");
        Validator.checkArgumentType(nextFalseStatementId, "nextFalseStatementId", "string");
        super(description, surroundScopeId, auxiliaryId, scopeId);
        this.condition = condition;
        this.nextTrueStatementId = nextTrueStatementId;
        this.nextFalseStatementId = nextFalseStatementId;
    }
}

class Case extends Fork {
    constructor(description, surroundScopeId, auxiliaryId, scopeId,
        varExpression, cases, nextCaseStatementIdList, nextDefaultStatementId) {
        Validator.checkArgumentType(varExpression, "varExpression", Expression);
        Validator.checkArgumentType(cases, "cases", Expression, Validator.ARGUMENT_IS_ARRAY);
        Validator.checkArgumentType(nextCaseStatementIdList, "nextCaseStatementIdList", "string", Validator.ARGUMENT_IS_ARRAY);
        Validator.checkArgumentType(nextDefaultStatementId, "nextDefaultStatementId", "string");
        super(description, surroundScopeId, auxiliaryId, scopeId);
        this.varExpression = varExpression;
        this.cases = cases;
        this.nextCaseStatementIdList = nextCaseStatementIdList;
        this.nextDefaultStatementId = nextDefaultStatementId;
    }
}

class Loop extends Compound {
    constructor(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId) {
        Validator.checkArgumentType(nextTrueStatementId, "nextTrueStatementId", "string");
        Validator.checkArgumentType(nextFalseStatementId, "nextFalseStatementId", "string");
        super(description, surroundScopeId, auxiliaryId, scopeId);
        this.nextTrueStatementId = nextTrueStatementId;
        this.nextFalseStatementId = nextFalseStatementId;
    }
}

class For extends Loop {
    constructor(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId,
        condition, initializeDeclarationId, incrementAsignmentId) {
        Validator.checkArgumentType(condition, "condition", Expression);
        Validator.checkArgumentType(initializeDeclarationId, "initializeDeclarationId", "string");
        Validator.checkArgumentType(incrementAsignmentId, "incrementAsignmentId", "string");
        super(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId);
        this.condition = condition;
        this.initializeDeclarationId = initializeDeclarationId;
        this.incrementAsignmentId = incrementAsignmentId;
    }
}

class ForEach extends Loop {
    constructor(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId,
        declarationId, collection) {
        Validator.checkArgumentType(declarationId, "declarationId", "string");
        Validator.checkArgumentType(collection, "collection", List);
        super(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId);
        this.declarationId = declarationId;
        this.collection = collection;
    }
}

class While extends Loop {
    constructor(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId, condition) {
        Validator.checkArgumentType(condition, "condition", Expression);
        super(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId);
        this.condition = condition;
    }
}

class DoWhile extends Loop {
    constructor(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId, condition) {
        Validator.checkArgumentType(condition, "condition", Expression);
        super(description, surroundScopeId, auxiliaryId, scopeId, nextTrueStatementId, nextFalseStatementId);
        this.condition = condition;
    }
}

export {
    Compound,
    Fork,
    IfElse,
    Case,
    Loop,
    For,
    ForEach,
    While,
    DoWhile,
}