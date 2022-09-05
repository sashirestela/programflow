import { Validator, Cardinality } from './../utils/validator.js';
import { Statement, Expression } from './statements.js';

class Single extends Statement {
    variableIdList = [];
    expressionList = [];
    
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.Zero);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.One);
        Object.assign(this, obj);
    }
}

class Declaration extends Single {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.variableIdList, "obj.variableIdList", "string", Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.variableIdList, "obj.variableIdList", Cardinality.AtLeastOne);
        Validator.checkArgumentType(obj.expressionList, "obj.expressionList", Expression, Validator.ARRAY, Validator.ALLOWNULLS);
        Validator.checkArgumentCardinality(obj.expressionList, "obj.expressionList", Cardinality.AtLeastOne);
        Validator.checkGeneralCondition(((a, b) => a.length === b.length)(obj.variableIdList, obj.expressionList),
            "Incongruent sizes: variableIdList and expressionList should have the same size.");
    }
}

class Assignment extends Single {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.variableIdList, "obj.variableIdList", "string", Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.variableIdList, "obj.variableIdList", Cardinality.AtLeastOne);
        Validator.checkArgumentType(obj.expressionList, "obj.expressionList", Expression, Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.expressionList, "obj.expressionList", Cardinality.AtLeastOne);
        Validator.checkGeneralCondition(((a, b) => a.length === b.length)(obj.variableIdList, obj.expressionList),
            "Incongruent sizes: variableIdList and expressionList should have the same size.");
    }
}

class Invocation extends Single {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.variableIdList, "obj.variableIdList", Cardinality.Zero);
        Validator.checkArgumentType(obj.expressionList, "obj.expressionList", Expression, Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.expressionList, "obj.expressionList", Cardinality.One);
    }
}

class Interaction extends Single {
    constructor(obj) {
        super(obj);
    }
}

class Input extends Interaction {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.variableIdList, "obj.variableIdList", "string", Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.variableIdList, "obj.variableIdList", Cardinality.AtLeastOne);
        Validator.checkArgumentCardinality(obj.expressionList, "obj.expressionList", Cardinality.Zero);
    }
}

class Output extends Interaction {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.variableIdList, "obj.variableIdList", Cardinality.Zero);
        Validator.checkArgumentType(obj.expressionList, "obj.expressionList", Expression, Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.expressionList, "obj.expressionList", Cardinality.AtLeastOne);
    }
}

class Terminal extends Statement {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.testExpression, "obj.testExpression", Cardinality.Zero);
    }
}

class Start extends Terminal {
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.One);
    }
}

class Return extends Terminal {
    expression = null;
    
    constructor(obj) {
        super(obj);
        Validator.checkArgumentCardinality(obj.pathIdList, "obj.pathIdList", Cardinality.Zero);
        Validator.checkArgumentTypeIfExists(obj.expression, "obj.expression", Expression);
        this.expression = obj.expression;
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
    Terminal,
    Start,
    Return
}