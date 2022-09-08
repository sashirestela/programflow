import { beforeAll, afterAll, describe, test, expect, jest } from '@jest/globals'
import { Primitive } from '../../src/model/datatypes.js'
import { Symbol, Variable, Function, ScopeType, Scope } from '../../src/model/symbols.js'
import { ArgumentTypeError, ArgumentCardinalityError } from '../../src/utils/validator.js'
import { Helper } from '../../src/utils/helper.js'
import util from 'util'
import crypto from 'crypto'

let uuidMock
const UUID = '123-456-789'

beforeAll(() => {
  uuidMock = jest.spyOn(crypto, 'randomUUID')
  uuidMock.mockImplementation(() => UUID)
})

afterAll(() => {
  uuidMock.mockRestore()
})

describe('Symbol class', () => {
  describe('parse method', () => {
    test('If a stringified Variable is parsed, it is recreated successfully.', () => {
      const original = new Variable({
        name: 'firstName',
        dataType: Primitive.String
      })
      const originalArray = [original]
      const jsonString = JSON.stringify(originalArray)
      const recreatedArray = Symbol.parse(jsonString)
      expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true)
    })
    test('If a stringified Function is parsed, it is recreated successfully.', () => {
      const original = new Function({
        name: 'add',
        dataType: Primitive.Real,
        paramIdList: [UUID, UUID, UUID],
        startStatementId: UUID,
        scopeId: UUID,
        isMain: Function.MAIN
      })
      const originalArray = [original]
      const jsonString = JSON.stringify(originalArray)
      const recreatedArray = Symbol.parse(jsonString)
      expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true)
    })
  })
})

describe('Variable class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const object = new Variable({ name: 'firstName', dataType: Primitive.String })
      expect(object.id).toBe(UUID)
      expect(object.className).toBe('Variable')
      expect(object.name).toBe('firstName')
      expect(util.isDeepStrictEqual(object.dataType, Primitive.String)).toBe(true)
    })
    test('If any expected argument is missed, an Error is raised.', () => {
      expect(() => new Variable({ name: 'firstName' })).toThrow(ArgumentCardinalityError)
    })
  })
})

describe('Function class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const object = new Function({
        name: 'add',
        dataType: Primitive.Real,
        paramIdList: [UUID, UUID, UUID],
        startStatementId: UUID,
        scopeId: UUID,
        isMain: Function.MAIN
      })
      expect(object.id).toBe(UUID)
      expect(object.className).toBe('Function')
      expect(object.name).toBe('add')
      expect(util.isDeepStrictEqual(object.dataType, Primitive.Real)).toBe(true)
      expect(object.paramIdList.length).toBe(3)
      expect(object.startStatementId).toBe(UUID)
      expect(object.scopeId).toBe(UUID)
      expect(object.isMain).toBe(true)
    })
    test('If any expected argument is missed, an Error is raised.', () => {
      expect(() => new Function({
        name: 'add',
        dataType: Primitive.Real,
        paramIdList: [UUID, UUID, UUID]
      })).toThrow(ArgumentTypeError)
    })
    test('If dataType is not provided, a new object is still created.', () => {
      const object = new Function({
        name: 'process',
        paramIdList: [UUID, UUID, UUID],
        startStatementId: UUID,
        scopeId: UUID
      })
      expect(object.id).toBe(UUID)
      expect(object.className).toBe('Function')
      expect(object.name).toBe('process')
      expect(object.dataType).toBeNull()
      expect(object.paramIdList.length).toBe(3)
      expect(object.startStatementId).toBe(UUID)
      expect(object.scopeId).toBe(UUID)
      expect(object.isMain).toBe(false)
    })
    test('If paramIdList is not provided, a new object is still created.', () => {
      const object = new Function({
        name: 'process',
        dataType: Primitive.Real,
        startStatementId: UUID,
        scopeId: UUID
      })
      expect(object.id).toBe(UUID)
      expect(object.className).toBe('Function')
      expect(object.name).toBe('process')
      expect(util.isDeepStrictEqual(object.dataType, Primitive.Real)).toBe(true)
      expect(object.paramIdList.length).toBe(0)
      expect(object.startStatementId).toBe(UUID)
      expect(object.scopeId).toBe(UUID)
      expect(object.isMain).toBe(false)
    })
    test('If dataType and paramIdList are not provided, a new object is still created.', () => {
      const object = new Function({
        name: 'process',
        startStatementId: UUID,
        scopeId: UUID
      })
      expect(object.id).toBe(UUID)
      expect(object.className).toBe('Function')
      expect(object.name).toBe('process')
      expect(object.dataType).toBeNull()
      expect(object.paramIdList.length).toBe(0)
      expect(object.startStatementId).toBe(UUID)
      expect(object.scopeId).toBe(UUID)
      expect(object.isMain).toBe(false)
    })
  })
})

describe('Scope class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const object = new Scope({ scopeType: ScopeType.Function })
      expect(object.id).toBe(UUID)
      expect(object.scopeType.type).toBe('Function')
      expect(object.parentScopeId).toBeNull()
    })
    test('If an object is stringified, parsed and passed, it is rightly recreated.', () => {
      const original = new Scope({ scopeType: ScopeType.CompoundLoop, parentScopeId: UUID })
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(ScopeType.reviver))
      const recreated = new Scope(parsed)
      expect(util.isDeepStrictEqual(original, recreated)).toBe(true)
    })
    test("If obj argument isn't passed, an Error is raised.", () => {
      expect(() => new Scope()).toThrow(ArgumentTypeError)
    })
  })
  describe('parse method', () => {
    test('If a stringified Scope is parsed, it is recreated successfully.', () => {
      const original = new Scope({
        scopeType: ScopeType.CompoundLoop,
        parentScopeId: UUID
      })
      const originalArray = [original]
      const jsonString = JSON.stringify(originalArray)
      const recreatedArray = Scope.parse(jsonString)
      expect(util.isDeepStrictEqual(originalArray, recreatedArray)).toBe(true)
    })
  })
})

describe('ScopeType class', () => {
  describe('list method', () => {
    test('Four predefined objects are listed.', () => {
      const scopes = ScopeType.list()
      expect(scopes.length).toBe(4)
    })
  })
  describe('reviver method', () => {
    test('Verify ScopeType is revived.', () => {
      const original = { scopeType: ScopeType.CompoundLoop }
      const str = JSON.stringify(original)
      const parsed = JSON.parse(str, Helper.pipeRevivers(ScopeType.reviver))
      expect(util.isDeepStrictEqual(original.scopeType, parsed.scopeType)).toBe(true)
    })
  })
})
