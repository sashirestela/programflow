import { beforeAll, afterAll, describe, test, expect, jest } from '@jest/globals'
import { Application } from '../../src/model/application.js'
import { ArgumentTypeError } from '../../src/utils/validator.js'
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

describe('Application class', () => {
  describe('constructor', () => {
    test('If obj is passed with all the expected fields, a new object is created.', () => {
      const object = new Application({
        name: 'Main Application',
        scopeId: UUID,
        functionIdList: [UUID]
      })
      expect(object.id).toBe(UUID)
      expect(object.name).toBe('Main Application')
      expect(object.scopeId).toBe(UUID)
      expect(object.functionIdList.length).toBe(1)
    })
    test('If any expected argument is missed, an Error is raised.', () => {
      expect(() => new Application({ name: 'Other App' })).toThrow(ArgumentTypeError)
    })
  })
})
