import { Helper } from './helper.js'

class Validator {
  static #checkArgumentType (argumentValue, parameterName, expectedType) {
    if (parameterName === undefined || expectedType === undefined) {
      throw new TypeError("Missing arguments 'parameterName' or 'expectedType'.")
    }
    if (typeof expectedType === 'function' || typeof expectedType === 'object') {
      if (!(argumentValue instanceof expectedType &&
                (Helper.classFromObject(argumentValue) === 'Object' ||
                    Helper.classFromClass(expectedType) !== 'Object'))
      ) {
        throw new ArgumentTypeError(parameterName, Helper.classFromClass(expectedType))
      }
    } else {
      if (typeof argumentValue !== expectedType) { // eslint-disable-line valid-typeof
        throw new ArgumentTypeError(parameterName, expectedType)
      }
    }
  }

  static checkArgumentType (argumentValue, parameterName, expectedType, isArray = false, allowNulls = false) {
    if (!isArray) {
      this.#checkArgumentType(argumentValue, parameterName, expectedType)
    } else {
      this.#checkArgumentType(argumentValue, parameterName, Array)
      argumentValue.forEach(elem => {
        if (!allowNulls || elem !== null) {
          this.#checkArgumentType(elem, parameterName, expectedType)
        }
      })
    }
  }

  static checkArgumentTypeIfExists (argumentValue, parameterName, expectedType, isArray = false, allowNulls = false) {
    if (argumentValue !== undefined && argumentValue !== null) {
      this.checkArgumentType(argumentValue, parameterName, expectedType, isArray, allowNulls)
    }
  }

  static checkArgumentCardinality (argumentValue, parameterName, expectedCardinality) {
    if (parameterName === undefined || expectedCardinality === undefined) {
      throw new TypeError("Missing arguments 'parameterName' or 'expectedCardinality'.")
    }
    if (expectedCardinality.number === Cardinality.Zero.number) {
      if (argumentValue !== undefined && argumentValue !== null) {
        if (typeof argumentValue !== 'object') {
          throw new ArgumentCardinalityError(parameterName, expectedCardinality)
        } else if (Object.keys(argumentValue).length > 0) {
          throw new ArgumentCardinalityError(parameterName, expectedCardinality)
        }
      }
    } else {
      if (argumentValue === undefined || argumentValue === null) {
        throw new ArgumentCardinalityError(parameterName, expectedCardinality)
      } else {
        if (Array.isArray(argumentValue)) {
          if (!Cardinality.isValid(argumentValue.length, expectedCardinality)) {
            throw new ArgumentCardinalityError(parameterName, expectedCardinality)
          }
        }
      }
    }
  }

  static checkGeneralCondition (conditionFunc, message) {
    if (!conditionFunc) {
      throw new GeneralConditionError(message)
    }
  }

  static get ARRAY () {
    return true
  }

  static get ALLOWNULLS () {
    return true
  }
}

class ArgumentTypeError extends TypeError {
  constructor (parameterName, expectedType) {
    const message = `Missing argument or wrong type for the parameter '${parameterName}'. The expected type is '${expectedType}'.`
    super(message)
  }
}

class ArgumentCardinalityError extends TypeError {
  constructor (parameterName, expectedCardinality) {
    const message = `Wrong cardinality for the parameter '${parameterName}'. The expected cardinality is '${expectedCardinality.text}'.`
    super(message)
  }
}

class UnexpectedValueError extends TypeError {
}

class GeneralConditionError extends Error {
}

class Cardinality {
  number
  text

  constructor (number, text) {
    this.number = number
    this.text = text
  }

  static isValid (number, cardinality) {
    return Number.isInteger(cardinality.number)
      ? number === cardinality.number
      : number > cardinality.number
  }

  static Zero = new Cardinality(0, 'none value')
  static AtLeastOne = new Cardinality(0.5, 'at least one value')
  static One = new Cardinality(1, 'exactly one value')
  static AtLeastTwo = new Cardinality(1.5, 'at least two values')
  static Two = new Cardinality(2, 'exactly two values')
}

export {
  Validator,
  ArgumentTypeError,
  ArgumentCardinalityError,
  UnexpectedValueError,
  GeneralConditionError,
  Cardinality
}
