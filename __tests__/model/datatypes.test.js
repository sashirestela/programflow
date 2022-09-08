import { describe, test, expect } from '@jest/globals'
import { DataType, Primitive, List, Matrix, Map } from '../../src/model/datatypes.js'
import { ArgumentTypeError, UnexpectedValueError } from '../../src/utils/validator.js'
import { Helper } from '../../src/utils/helper.js'
import util from 'util'

describe('Primitive class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const prim = new Primitive({ type: 'Double' })
      expect(prim.className).toBe('Primitive')
      expect(prim.type).toBe('Double')
    })
    test("If obj argument isn't passed, an Error is raised.", () => {
      expect(() => new Primitive()).toThrow(ArgumentTypeError)
    })
  })
  describe('list method', () => {
    test('Four predefined objects are listed.', () => {
      const primitives = Primitive.list()
      expect(primitives[0]).toBe('Boolean')
      expect(primitives[1]).toBe('String')
      expect(primitives[2]).toBe('Integer')
      expect(primitives[3]).toBe('Real')
    })
  })
  describe('find method', () => {
    test('If an existing type is passed, a Primitive object is returned.', () => {
      const result = Primitive.find('Integer')
      expect(util.isDeepStrictEqual(result, Primitive.Integer)).toBe(true)
    })
    test('If a no existing type is passed, an Error is raised.', () => {
      expect(() => Primitive.find('Complex')).toThrow(UnexpectedValueError)
    })
  })
})

describe('List class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const prim = new List({ element: Primitive.Integer })
      expect(prim.className).toBe('List')
      expect(prim.element.type).toBe('Integer')
    })
    test("If obj argument isn't passed, an Error is raised.", () => {
      expect(() => new List()).toThrow(ArgumentTypeError)
    })
  })
})

describe('Matrix class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const prim = new Matrix({ innerElement: Primitive.Integer })
      expect(prim.className).toBe('Matrix')
      expect(prim.element.className).toBe('List')
      expect(prim.innerElement.type).toBe('Integer')
    })
    test("If obj argument isn't passed, an Error is raised.", () => {
      expect(() => new Matrix()).toThrow(ArgumentTypeError)
    })
  })
})

describe('Map class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const prim = new Map({ key: Primitive.String, value: Primitive.Real })
      expect(prim.className).toBe('Map')
      expect(prim.key.type).toBe('String')
      expect(prim.value.type).toBe('Real')
    })
    test("If obj argument isn't passed, an Error is raised.", () => {
      expect(() => new Map()).toThrow(ArgumentTypeError)
    })
  })
})

describe('DataType class', () => {
  describe('categoriesOf method', () => {
    test('Two predefined main data type names are listed.', () => {
      const mainCategories = DataType.categoriesOf()
      expect(mainCategories[0]).toBe('Primitive')
      expect(mainCategories[1]).toBe('Collection')
    })
    test('Three predefined Collection data type names are listed.', () => {
      const collCategories = DataType.categoriesOf('Collection')
      expect(collCategories[0]).toBe('List')
      expect(collCategories[1]).toBe('Matrix')
      expect(collCategories[2]).toBe('Map')
    })
  })
  describe('create method', () => {
    test('If correct values to create a Primitive are passed, the object is created.', () => {
      const expected = Primitive.Real
      const result = DataType.create('Primitive', 'Real')
      expect(util.isDeepStrictEqual(expected, result)).toBe(true)
    })
    test('If correct values to create a List are passed, the object is created.', () => {
      const expected = new List({ element: Primitive.Boolean })
      const result = DataType.create('List', 'Boolean')
      expect(util.isDeepStrictEqual(expected, result)).toBe(true)
    })
    test('If correct values to create a Matrix are passed, the object is created.', () => {
      const expected = new Matrix({ innerElement: Primitive.Integer })
      const result = DataType.create('Matrix', 'Integer')
      expect(util.isDeepStrictEqual(expected, result)).toBe(true)
    })
    test('If correct values to create a Map are passed, the object is created.', () => {
      const expected = new Map({ key: Primitive.String, value: Primitive.Integer })
      const result = DataType.create('Map', 'String', 'Integer')
      expect(util.isDeepStrictEqual(expected, result)).toBe(true)
    })
    test('If wrong values to create a Data Type are passed, an Error is raised.', () => {
      expect(() => DataType.create('Map', 'String', 'Complex')).toThrow(UnexpectedValueError)
    })
    test('If a wrong category is passed, an Error is raised.', () => {
      expect(() => DataType.create('Array', 'Real')).toThrow(UnexpectedValueError)
    })
  })
  describe('reviver method', () => {
    test('Verify Primitive is revived.', () => {
      const original = { data: Primitive.Integer }
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver))
      expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true)
    })
    test('Verify List is revived.', () => {
      const original = { data: new List({ element: Primitive.Boolean }) }
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver))
      expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true)
    })
    test('Verify Matrix is revived.', () => {
      const original = { data: new Matrix({ innerElement: Primitive.String }) }
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver))
      expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true)
    })
    test('Verify Map is revived.', () => {
      const original = { data: new Map({ key: Primitive.String, value: Primitive.Integer }) }
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(DataType.reviver))
      expect(util.isDeepStrictEqual(original.data, parsed.data)).toBe(true)
    })
  })
})
