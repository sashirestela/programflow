import { describe, test, expect } from '@jest/globals'
import { ArgumentTypeError, ArgumentCardinalityError, GeneralConditionError, Validator, Cardinality } from '../../src/utils/validator.js'

class AuxClass {
  constructor (id) {
    this.id = id
  }
}

describe('Validator class', () => {
  describe('checkArgumentType method', () => {
    test('If parameterName or expectedType arguments are missed, a TypeError is raised.', () => {
      expect(() => Validator.checkArgumentType(7)).toThrow(TypeError)
      expect(() => Validator.checkArgumentType(7, 'paramName')).toThrow(TypeError)
      expect(() => Validator.checkArgumentType({}, undefined, Array)).toThrow(TypeError)
    })
    test("If expectedType is scalar and argumentValue's type is the expected, then validation passes.", () => {
      const argumentValue = 'Peter'
      const parameterName = 'firstName'
      const expectedType = 'string'
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow()
    })
    test("If expectedType is scalar and argumentValue's type isn't the expected, then validation fails.", () => {
      const argumentValue = 'twenty'
      const parameterName = 'age'
      const expectedType = 'number'
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError)
    })
    test("If expectedType is class and argumentValue's type is the expected, then validation passes.", () => {
      const argumentValue = new AuxClass(1)
      const parameterName = 'id'
      const expectedType = AuxClass
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow()
    })
    test("If expectedType is class and argumentValue's type isn't the expected, then validation fails.", () => {
      const argumentValue = new Date()
      const parameterName = 'dateOfBirth'
      const expectedType = AuxClass
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError)
    })
    test("If expectedType is object and argumentValue's type is the expected, then validation passes.", () => {
      const argumentValue = { a: 1, b: 2 }
      const parameterName = 'confObject'
      const expectedType = Object
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).not.toThrow()
    })
    test("If expectedType is object and argumentValue's type isn't the expected, then validation fails.", () => {
      const argumentValue = new AuxClass(2)
      const parameterName = 'auxiliar'
      const expectedType = Object
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType)).toThrow(ArgumentTypeError)
    })
    test("For array, if expectedType and argumentValue's type are the same, then validation passes.", () => {
      const argumentValue = [new AuxClass(1), new AuxClass(2)]
      const parameterName = 'auxiliarList'
      const expectedType = AuxClass
      const isArray = Validator.ARRAY
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).not.toThrow()
    })
    test("For array, if expectedType and argumentValue's type aren't the same, then validation fails.", () => {
      const argumentValue = ['element1', 'element2']
      const parameterName = 'auxiliarList'
      const expectedType = AuxClass
      const isArray = Validator.ARRAY
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).toThrow(ArgumentTypeError)
    })
    test('For array, if argumentValue is an empty array, then validation passes.', () => {
      const argumentValue = []
      const parameterName = 'auxiliarList'
      const expectedType = AuxClass
      const isArray = Validator.ARRAY
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).not.toThrow()
    })
    test('For array, if an element of argumentValue is null and allowNulls is false, then validation fails.', () => {
      const argumentValue = [1, 2, 3, null, 5, 6]
      const parameterName = 'auxiliarList'
      const expectedType = 'number'
      const isArray = Validator.ARRAY
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray)).toThrow(ArgumentTypeError)
    })
    test('For array, if an element of argumentValue is null and allowNulls is true, then validation passes.', () => {
      const argumentValue = [1, 2, 3, null, 5, 6]
      const parameterName = 'auxiliarList'
      const expectedType = 'number'
      const isArray = Validator.ARRAY
      const allowNulls = Validator.ALLOWNULLS
      expect(() => Validator.checkArgumentType(argumentValue, parameterName, expectedType, isArray, allowNulls)).not.toThrow()
    })
  })
  describe('checkArgumentTypeIfExists method', () => {
    test('If argumentValue is undefined, then validation is bypassed.', () => {
      const argumentValue = undefined
      const parameterName = 'field'
      const expectedType = 'string'
      expect(() => Validator.checkArgumentTypeIfExists(argumentValue, parameterName, expectedType)).not.toThrow()
    })
    test('If argumentValue has a value, then validation is executed.', () => {
      const argumentValue = false
      const parameterName = 'isEnabled'
      const expectedType = 'boolean'
      expect(() => Validator.checkArgumentTypeIfExists(argumentValue, parameterName, expectedType)).not.toThrow()
    })
  })
  describe('checkArgumentCardinality method', () => {
    test('If parameterName or expectedType arguments are missed, a TypeError is raised.', () => {
      expect(() => Validator.checkArgumentCardinality(7)).toThrow(TypeError)
      expect(() => Validator.checkArgumentCardinality('example', 'paramName')).toThrow(TypeError)
      expect(() => Validator.checkArgumentCardinality([3, 8], undefined, Validator.Two)).toThrow(TypeError)
    })
    test('If expectedCardinality is zero and argumentValue is undefined, then validation passes.', () => {
      const argumentValue = undefined
      const parameterName = 'grade'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test('If expectedCardinality is zero and argumentValue is an empty array, then validation passes.', () => {
      const argumentValue = []
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test('If expectedCardinality is zero and argumentValue is an empty map, then validation passes.', () => {
      const argumentValue = {}
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test('If expectedCardinality is zero and argumentValue is a scalar value, then validation fails.', () => {
      const argumentValue = 12
      const parameterName = 'grade'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
    test("If expectedCardinality is zero and argumentValue isn't an empty array, then validation fails.", () => {
      const argumentValue = [13, 17]
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
    test('If expectedCardinality is zero and argumentValue is an object, then validation fails.', () => {
      const argumentValue = new AuxClass('12345')
      const parameterName = 'auxiliar'
      const expectedCardinality = Cardinality.Zero
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
    test('If expectedCardinality is greater than zero and argumentValue is undefined, then validation fails.', () => {
      const argumentValue = undefined
      const parameterName = 'auxiliar'
      const expectedCardinality = Cardinality.One
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
    test('If expectedCardinality is greater than zero and argumentValue has a value, then validation passes.', () => {
      const argumentValue = new AuxClass('12345')
      const parameterName = 'auxiliar'
      const expectedCardinality = Cardinality.One
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test("If expectedCardinality number and argumentValue's length are the same and <= 2, then validation passes.", () => {
      const argumentValue = [13, 17]
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.Two
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test("If expectedCardinality number and argumentValue's length are greater than 2, then validation passes.", () => {
      const argumentValue = [13, 17, 15]
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.AtLeastTwo
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).not.toThrow()
    })
    test("If expectedCardinality number is <= 2 and argumentValue's length are different, then validation fails.", () => {
      const argumentValue = [13, 17, 15]
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.Two
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
    test('If expectedCardinality number is > 1 and argumentValue is an empty array, then validation fails.', () => {
      const argumentValue = []
      const parameterName = 'grades'
      const expectedCardinality = Cardinality.AtLeastOne
      expect(() => Validator.checkArgumentCardinality(argumentValue, parameterName, expectedCardinality)).toThrow(ArgumentCardinalityError)
    })
  })
  describe('checkGeneralCondition method', () => {
    test('If the conditionFunc is evaluated to false, then validation fails.', () => {
      const checkEachIsDefined = a => a.every(elem => elem !== null)
      const data = [1, 2, 3, null, 5]
      expect(() => Validator.checkGeneralCondition(checkEachIsDefined(data), 'Error')).toThrow(GeneralConditionError)
    })
    test('If the conditionFunc is evaluated to true, then validation passes.', () => {
      const checkEachIsDefined = a => a.every(elem => elem !== null)
      const data = [1, 2, 3, 4, 5]
      expect(() => Validator.checkGeneralCondition(checkEachIsDefined(data), 'Error')).not.toThrow()
    })
  })
})
