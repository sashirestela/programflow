import { Validator, Cardinality } from './../utils/validator.js';
import { List } from './datatypes.js';
import { Statement, TestType } from './statements.js';

class Compound extends Statement {
    relatedId = null;
    scopeId = null;

    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.relatedId, "obj.relatedId", "string");
        Validator.checkArgumentType(obj.scopeId, "obj.scopeId", "string");
        Object.assign(this, obj);
    }
}

class Fork extends Compound {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.One);
    }
}

class IfElse extends Fork {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.Two);
    }
}

class Case extends Fork {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.AtLeastTwo);
        this.testType = TestType.Discrete;
    }
}

class Loop extends Compound {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.Two);
    }
}

class For extends Loop {
    declarationId = null;
    assignmentId = null;
    
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.One);
        Validator.checkArgumentType(obj.declarationId, "obj.declarationId", "string");
        Validator.checkArgumentType(obj.assignmentId, "obj.assignmentId", "string");
        Object.assign(this, obj);
    }
}

class ForEach extends Loop {
    declarationId = null;
    collection = null;
    
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.Zero);
        Validator.checkArgumentType(obj.declarationId, "obj.declarationId", "string");
        Validator.checkArgumentType(obj.collection, "obj.collection", List);
        Object.assign(this, obj);
    }
}

class While extends Loop {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.One);
    }
}

class DoWhile extends Loop {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.One);
    }
}

class Jump extends Statement {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.One);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.Two);
    }
}

class Break extends Jump {
    constructor(obj) {
        super(obj);
    }
}

class Continue extends Jump {
    constructor(obj) {
        super(obj);
    }
}

class Boundary extends Statement {
    relatedId = null;
    
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.Zero);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.One);
        Object.assign(this, obj);
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
    Jump,
    Break,
    Continue,
    Boundary
}