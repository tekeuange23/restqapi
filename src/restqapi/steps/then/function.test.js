beforeEach(() => {
  jest.resetModules()
})

describe('#StepDefinition - then - functions', () => {


  test('Configuration', () => {
    const Then = require('./functions')
    let fns  = Object.keys(Then)
    expect(fns.length).toBe(20)
    let expectedFunctions = [
      'httpCode',
      'httpTiming',
      'headerValueExist',
      'headerValueNotExist',
      'headerValueEqual',
      'headers',
      'shouldBeEmptyArrayResponse',
      'shouldBeEmptyResponse',
      'shouldBeString',
      'shouldBeNumber',
      'shouldBeTrue',
      'shouldBeFalse',
      'shouldBeNull',
      'shouldBeEmpty',
      'shouldBeNow',
      'shouldMatch',
      'shouldBeArraySize',
      'shouldNotBeNull',
      'addHeaderPropertyToDataset',
      'addBodyPropertyToDataset'
    ]
    expect(fns).toEqual(expectedFunctions)
  })

  describe('API Default Functions', () => {
    test('httpCode', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      let $this = {
        api : {
          response: {
            statusCode: 201,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpCode.call($this, 200)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(201)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(200)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response httpCode is invalid, received 201 should be 200')
    })

    test('httpTiming - When timing is higher', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      let $this = {
        api : {
          response: {
            timing: 1000,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpTiming.call($this, 200)

      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toBe(false)
      expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response time is invalid, received 1000 should be lower than 200')
    })

    test('httpTiming - When timing is lower', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      let $this = {
        api : {
          response: {
            timing: 100,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpTiming.call($this, 200)

      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toBe(true)
    })
  })

  describe('API Headers Functions', () => {

    test('headerValueExist', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.notStrictEqual = jest.fn()

      let $this = {
        api : {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueExist.call($this, 'x-req-id')

      expect(assert.notStrictEqual.mock.calls.length).toBe(1)
      expect(assert.notStrictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.notStrictEqual.mock.calls[0][1]).toBeUndefined()
      expect(assert.notStrictEqual.mock.calls[0][2]).toBe('[POST /users] The response header should contain the x-req-id property')
    })

    test('headerValueNotExist', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      let $this = {
        api : {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueNotExist.call($this, 'x-req-id')

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.strictEqual.mock.calls[0][1]).toBeUndefined()
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response header should not contain the x-req-id property')
    })

    test('headerValueEqual', () => {

      let assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      let $this = {
        api : {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueEqual.call($this, 'x-req-id', 'aaa-bbb-ccc')

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.strictEqual.mock.calls[0][1]).toBe('aaa-bbb-ccc')
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response header is invalid, the x-req-id property should be aaa-bbb-ccc but received xxx-yyy-zzz')
    })

    test('headers', () => {

      const Then = require('./functions')
      Then.headerValueEqual = jest.fn()
      let table = {
        raw: () =>{
          return [
            ['foo', 'bar'],
            ['abc', 'def']
          ]
        }
      }
      Then.headers.call({}, table)

      expect(Then.headerValueEqual.mock.calls.length).toBe(2)
      expect(Then.headerValueEqual.mock.calls[0][0]).toBe('foo')
      expect(Then.headerValueEqual.mock.calls[0][1]).toBe('bar')
      expect(Then.headerValueEqual.mock.calls[1][0]).toBe('abc')
      expect(Then.headerValueEqual.mock.calls[1][1]).toBe('def')
    })
  })
})
