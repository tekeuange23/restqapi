describe('#StepDefinition - given - functions', () => {

  const Given = require('./functions')

  test('Configuration', () => {
    let fns  = Object.keys(Given)
    expect(fns.length).toBe(14)
    let expectedFunctions = [
      'gateway',
      'path',
      'method',
      'methodPath',
      'header',
      'headers',
      'queryString',
      'qs',
      'payload',
      'payloadNull',
      'payloadTrue',
      'payloadFalse',
      'payloadEmptyArray',
      'payloads'
    ]
    expect(fns).toEqual(expectedFunctions)
  })

  describe('API Default Functions', () => {
    test('gateway', () => {
      let $this = {
        createApi : jest.fn().mockReturnValue({foo: 'bar'})
      }
      Given.gateway.call($this)
      expect($this.createApi.mock.calls.length).toBe(1)
      expect($this.createApi.mock.calls[0][0]).toBeUndefined()
      expect($this.api).toEqual({foo: 'bar'})
    })

    test('path', () => {
      let $this = {
        api : {
          request: {
            setPath: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('/foo-bar')
        }
      }
      Given.path.call($this, '/foo')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('/foo')
      expect($this.api.request.setPath.mock.calls.length).toBe(1)
      expect($this.api.request.setPath.mock.calls[0][0]).toBe('/foo-bar')
    })

    test('method', () => {
      let $this = {
        api : {
          request: {
            setMethod: jest.fn()
          }
        }
      }
      Given.method.call($this, 'POST')
      expect($this.api.request.setMethod.mock.calls.length).toBe(1)
      expect($this.api.request.setMethod.mock.calls[0][0]).toBe('post')
    })

    test('method is not a valid http method', () => {
      let $this = {
        api : {
          request: {
            setMethod: jest.fn()
          }
        }
      }
      expect(() => {
        Given.method.call($this, 'POOST')
      }).toThrow(new Error('"POOST" is not a valid http method. Accepted : https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods'));
      expect($this.api.request.setMethod.mock.calls.length).toBe(0)
    })

    test('methodPath', () => {
      let $this = {
        api : {
          request: {
            setMethod: jest.fn(),
            setPath: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('/bar-001')
        }
      }
      Given.methodPath.call($this, 'PUT', '/bar')
      expect($this.api.request.setMethod.mock.calls.length).toBe(1)
      expect($this.api.request.setMethod.mock.calls[0][0]).toBe('put')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('/bar')
      expect($this.api.request.setPath.mock.calls.length).toBe(1)
      expect($this.api.request.setPath.mock.calls[0][0]).toBe('/bar-001')
    })
  })

  describe('Request header Functions', () => {

    test('header', () => {
      let $this = {
        api : {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('bar1')
        }
      }
      Given.header.call($this, 'x-foo', 'bar')
      expect($this.api.request.setHeader.mock.calls.length).toBe(1)
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe('x-foo')
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe('bar1')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('bar')
    })

    test('headers', () => {
      let $this = {
        api : {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn(_ => {
            return _ + '123'
          })
        }
      }

      let table = {
        raw: () => {
          return  [
            ['x-foo', 'foo-value'],
            ['x-bar', 'bar-value'],
          ]
        }
      }
      Given.headers.call($this, table)
      expect($this.api.request.setHeader.mock.calls.length).toBe(2)
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe('x-foo')
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe('foo-value123')
      expect($this.api.request.setHeader.mock.calls[1][0]).toBe('x-bar')
      expect($this.api.request.setHeader.mock.calls[1][1]).toBe('bar-value123')
      expect($this.data.get.mock.calls.length).toBe(2)
      expect($this.data.get.mock.calls[0][0]).toBe('foo-value')
      expect($this.data.get.mock.calls[1][0]).toBe('bar-value')
    })
  })

  describe('Request query string Functions', () => {

    test('queryString', () => {
      let $this = {
        api : {
          request: {
            setQueryString: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('bar1')
        }
      }
      Given.queryString.call($this, 'param1', 'bar')
      expect($this.api.request.setQueryString.mock.calls.length).toBe(1)
      expect($this.api.request.setQueryString.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.setQueryString.mock.calls[0][1]).toBe('bar1')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('bar')
    })

    test('qs', () => {
      let $this = {
        api : {
          request: {
            setQueryString: jest.fn()
          }
        },
        data: {
          get: jest.fn(_ => {
            return _ + '123'
          })
        }
      }

      let table = {
        raw: () => {
          return  [
            ['param1', 'foo'],
            ['param2', 'bar'],
          ]
        }
      }
      Given.qs.call($this, table)
      expect($this.api.request.setQueryString.mock.calls.length).toBe(2)
      expect($this.api.request.setQueryString.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.setQueryString.mock.calls[0][1]).toBe('foo123')
      expect($this.api.request.setQueryString.mock.calls[1][0]).toBe('param2')
      expect($this.api.request.setQueryString.mock.calls[1][1]).toBe('bar123')
      expect($this.data.get.mock.calls.length).toBe(2)
      expect($this.data.get.mock.calls[0][0]).toBe('foo')
      expect($this.data.get.mock.calls[1][0]).toBe('bar')
    })
  })

  describe('Request body Functions', () => {

    test('payload', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('bar1')
        }
      }
      Given.payload.call($this, 'param1', 'bar')
      expect($this.api.request.addPayload.mock.calls.length).toBe(1)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe('bar1')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('bar')
    })

    test('payloadNull', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        }
      }
      Given.payloadNull.call($this, 'param1')
      expect($this.api.request.addPayload.mock.calls.length).toBe(1)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe(null)
    })

    test('payloadTrue', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        }
      }
      Given.payloadTrue.call($this, 'param1')
      expect($this.api.request.addPayload.mock.calls.length).toBe(1)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe(true)
    })

    test('payloadFalse', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        }
      }
      Given.payloadFalse.call($this, 'param1')
      expect($this.api.request.addPayload.mock.calls.length).toBe(1)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe(false)
    })

    test('payloadEmptyArray', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        }
      }
      Given.payloadEmptyArray.call($this, 'param1')
      expect($this.api.request.addPayload.mock.calls.length).toBe(1)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toStrictEqual([])
    })

    test('payloads', () => {
      let $this = {
        api : {
          request: {
            addPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn(_ => {
            return _ + '123'
          })
        }
      }

      let table = {
        raw: () => {
          return  [
            ['param.foo1', 'foo'],
            ['param.foo2', 'bar'],
          ]
        }
      }
      Given.payloads.call($this, table)
      expect($this.api.request.addPayload.mock.calls.length).toBe(2)
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe('param.foo1')
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe('foo123')
      expect($this.api.request.addPayload.mock.calls[1][0]).toBe('param.foo2')
      expect($this.api.request.addPayload.mock.calls[1][1]).toBe('bar123')
      expect($this.data.get.mock.calls.length).toBe(2)
      expect($this.data.get.mock.calls[0][0]).toBe('foo')
      expect($this.data.get.mock.calls[1][0]).toBe('bar')
    })
  })
})

