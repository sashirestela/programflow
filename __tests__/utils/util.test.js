import { describe, test, expect } from '@jest/globals'
import { Util } from '../../src/utils/util.js'

describe('Util class', () => {
  describe('isNull method', () => {
    test('If a null value is passed, true should be returned.', () => {
      const value = null
      const result = Util.isNull(value)
      expect(result).toBe(true)
    })
    test('If a not null value is passed, false should be returned.', () => {
      const value = 123
      const result = Util.isNull(value)
      expect(result).toBe(false)
    })
    test('If an undefined value is passed, false should be returned.', () => {
      const value = undefined
      const result = Util.isNull(value)
      expect(result).toBe(false)
    })
  })
  describe('isUndefined method', () => {
    test('If an undefined value is passed, true should be returned.', () => {
      const value = undefined
      const result = Util.isUndefined(value)
      expect(result).toBe(true)
    })
    test('If a not undefined value is passed, false should be returned.', () => {
      const value = 123
      const result = Util.isUndefined(value)
      expect(result).toBe(false)
    })
    test('If a null value is passed, false should be returned.', () => {
      const value = null
      const result = Util.isUndefined(value)
      expect(result).toBe(false)
    })
  })
  describe('isNothing method', () => {
    test('If a null value is passed, true should be returned.', () => {
      const value = null
      const result = Util.isNothing(value)
      expect(result).toBe(true)
    })
    test('If an undefined value is passed, true should be returned.', () => {
      const value = undefined
      const result = Util.isNothing(value)
      expect(result).toBe(true)
    })
    test('If a concrete value is passed, false should be returned.', () => {
      const value = 'testing'
      const result = Util.isNothing(value)
      expect(result).toBe(false)
    })
  })
  describe('someNull method', () => {
    test('If at least a null value is passed, true should be returned.', () => {
      const result = Util.someNull(1, 'test', null, true)
      expect(result).toBe(true)
    })
    test('If none null value is passed, false should be returned.', () => {
      const result = Util.someNull(1, 'test', undefined, true)
      expect(result).toBe(false)
    })
  })
  describe('someUndefined method', () => {
    test('If at least an undefined value is passed, true should be returned.', () => {
      const result = Util.someUndefined(1, 'test', undefined, true)
      expect(result).toBe(true)
    })
    test('If none undefined value is passed, false should be returned.', () => {
      const result = Util.someUndefined(1, 'test', null, true)
      expect(result).toBe(false)
    })
  })
  describe('isTypeOf method', () => {
    test('If the value type matches some of the passed types, true should be returned.', () => {
      const result = Util.isTypeOf(10, 'string', 'number')
      expect(result).toBe(true)
    })
    test('If the value type does not match any of the passed types, false should be returned.', () => {
      const result = Util.isTypeOf(10, 'string', 'boolean')
      expect(result).toBe(false)
    })
  })
  describe('isObject method', () => {
    test('If the value is an object, true should be returned.', () => {
      const result = Util.isObject({a:10, b:true, c:'test'})
      expect(result).toBe(true)
    })
    test('If the value is not an object, false should be returned.', () => {
      const result = Util.isObject('test')
      expect(result).toBe(false)
    })
  })
  describe('isClass method', () => {
    test('If the value is a class, true should be returned.', () => {
      const result = Util.isClass(Date)
      expect(result).toBe(true)
    })
    test('If the value is not a class, false should be returned.', () => {
      const result = Util.isClass({})
      expect(result).toBe(false)
    })
  })
  describe('isInstanceOf method', () => {
    test('If the value class matches the passed class, true should be returned.', () => {
      const result = Util.isInstanceOf(new Date(), Date)
      expect(result).toBe(true)
    })
    test('If the array matches the Array class, true should be returned.', () => {
      const result = Util.isInstanceOf([1, 2, 3], Array)
      expect(result).toBe(true)
    })
    test('If the value class does not match the passed class, false should be returned.', () => {
      const result = Util.isInstanceOf(new String('test'), Date)
      expect(result).toBe(false)
    })
  })
})
