import { Helper } from './../utils/helper.js'
import { Validator } from './../utils/validator.js'
import { DataType } from './datatypes.js'
import { Declaration, Assignment, Invocation, Input, Output, Start, Return, IfElse, Case, For, ForEach, While, DoWhile, Break, Continue, Boundary } from './statements.js'

class Statement {
  id = Helper.uuid()
  className = Helper.classFromObject(this)
  surroundScopeId = null
  testExpression = null
  testType = TestType.Logical
  pathIdList = []
  description = null
  comment = null

  constructor (obj) {
    Validator.checkArgumentType(obj, 'obj', Object)
    Validator.checkArgumentType(obj.surroundScopeId, 'obj.surroundScopeId', 'string')
    Validator.checkArgumentTypeIfExists(obj.testExpression, 'obj.testExpression', Expression)
    Validator.checkArgumentTypeIfExists(obj.pathIdList, 'obj.pathIdList', 'string', Validator.ARRAY)
    Validator.checkArgumentTypeIfExists(obj.description, 'obj.description', 'string')
    Object.assign(this, obj)
  }

  static reviver (k, v) {
    if (v === null || v.className === null) {
      return v
    }
    switch (v.className) {
      case 'Declaration':
        return new Declaration(v)
      case 'Assignment':
        return new Assignment(v)
      case 'Invocation':
        return new Invocation(v)
      case 'Input':
        return new Input(v)
      case 'Output':
        return new Output(v)
      case 'Start':
        return new Start(v)
      case 'Return':
        return new Return(v)
      case 'IfElse':
        return new IfElse(v)
      case 'Case':
        return new Case(v)
      case 'For':
        return new For(v)
      case 'ForEach':
        return new ForEach(v)
      case 'While':
        return new While(v)
      case 'DoWhile':
        return new DoWhile(v)
      case 'Break':
        return new Break(v)
      case 'Continue':
        return new Continue(v)
      case 'Boundary':
        return new Boundary(v)
      default:
        return v
    }
  }

  static parse (jsonString) {
    return JSON.parse(jsonString, Helper.pipeRevivers(
      TestType.reviver, Expression.reviver, DataType.reviver, Statement.reviver))
  }
}

class Path {
  id = Helper.uuid()
  enabled = true
  case = null
  prevStatementId = null
  nextStatementId = null

  constructor (obj) {
    Validator.checkArgumentType(obj, 'obj', Object)
    Validator.checkArgumentTypeIfExists(obj.enabled, 'obj.enabled', 'boolean')
    Validator.checkArgumentTypeIfExists(obj.case, 'obj.case', Expression)
    Validator.checkArgumentType(obj.prevStatementId, 'obj.prevStatementId', 'string')
    Validator.checkArgumentType(obj.nextStatementId, 'obj.nextStatementId', 'string')
    Object.assign(this, obj)
  }

  static reviver (k, v) {
    return (v !== null && v.nextStatementId !== undefined ? new Path(v) : v)
  }

  static parse (jsonString) {
    return JSON.parse(jsonString, Helper.pipeRevivers(
      Expression.reviver, Path.reviver))
  }

  static get DISABLED () {
    return false
  }
}

class Expression {
  anExpression = null

  constructor (anExpression) {
    Validator.checkArgumentType(anExpression, 'anExpression', 'string')
    this.anExpression = anExpression
  }

  static reviver (k, v) {
    return (v !== null && v.anExpression !== undefined ? new Expression(v.anExpression) : v)
  }
}

class TestType {
  type

  constructor (type) {
    this.type = type
  }

  static reviver (k, v) {
    return (k === 'testType' ? new TestType(v.type) : v)
  }

  static Logical = new TestType('Logical')
  static Discrete = new TestType('Discrete')
}

export {
  Statement,
  Path,
  Expression,
  TestType
}
