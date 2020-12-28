beforeEach(() => {
  jest.resetModules()
})

describe('#StepDefinition - given - functions', () => {
  const Given = require('./functions')

  test('Configuration', () => {
    const fns = Object.keys(Given)
    expect(fns.length).toBe(21)
    const expectedFunctions = [
      'gateway',
      'gatewayHost',
      'path',
      'method',
      'methodPath',
      'header',
      'headers',
      'bearer',
      'basicAuth',
      'queryString',
      'qs',
      'payload',
      'payloadNull',
      'payloadTrue',
      'payloadFalse',
      'payloadEmptyArray',
      'payloads',
      'jsonPayload',
      'form',
      'forms',
      'formUpload'
    ]
    expect(fns).toEqual(expectedFunctions)
  })

  describe('API Default Functions', () => {
    test('gateway', () => {
      const mockApi = {
        foo: 'bar',
        request: {
          setHeader: jest.fn()
        }
      }
      const $this = {
        createApi: jest.fn().mockReturnValue(mockApi),
        _config: {
          data: {}
        },
        data: {
          get: jest.fn().mockReturnValue('coooookie')
        }
      }
      Given.gateway.call($this)
      expect($this.createApi.mock.calls.length).toBe(1)
      expect($this.createApi.mock.calls[0][0]).toBeUndefined()
      expect($this.api).toEqual(mockApi)
      expect($this.api.request.setHeader.mock.calls.length).toEqual(1)
      expect($this.api.request.setHeader.mock.calls[0][0]).toEqual('cookie')
      expect($this.api.request.setHeader.mock.calls[0][1]).toEqual('coooookie')
      expect($this.data.get.mock.calls.length).toEqual(1)
      expect($this.data.get.mock.calls[0][0]).toEqual('{{__cookie_jar__}}')
    })

    test('gatewayHost with a given url', () => {
      const mockApi = {
        foo: 'bar',
        request: {
          setHeader: jest.fn()
        }
      }
      const $this = {
        createApi: jest.fn().mockReturnValue(mockApi),
        _config: {
          data: {
            startSymbol: '[[',
            endSymbol: ']]'
          }
        },
        data: {
          get: jest.fn().mockReturnValue('coooookie')
        }
      }
      Given.gatewayHost.call($this, 'http://example.test')
      expect($this.createApi.mock.calls.length).toBe(1)
      expect($this.createApi.mock.calls[0][0]).toBe('http://example.test')
      expect($this.api).toEqual(mockApi)
      expect($this.api.request.setHeader.mock.calls.length).toEqual(1)
      expect($this.api.request.setHeader.mock.calls[0][0]).toEqual('cookie')
      expect($this.api.request.setHeader.mock.calls[0][1]).toEqual('coooookie')
      expect($this.data.get.mock.calls.length).toEqual(1)
      expect($this.data.get.mock.calls[0][0]).toEqual('[[__cookie_jar__]]')
    })

    test('path', () => {
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
          request: {
            setMethod: jest.fn()
          }
        }
      }
      expect(() => {
        Given.method.call($this, 'POOST')
      }).toThrow(new Error('"POOST" is not a valid http method. Accepted : https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods'))
      expect($this.api.request.setMethod.mock.calls.length).toBe(0)
    })

    test('methodPath', () => {
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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

      const table = {
        raw: () => {
          return [
            ['x-foo', 'foo-value'],
            ['x-bar', 'bar-value']
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

    test('bearer', () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('Bearer bar1')
        }
      }
      Given.bearer.call($this, 'bar')
      expect($this.api.request.setHeader.mock.calls.length).toBe(1)
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe('authorization')
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe('Bearer bar1')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('Bearer bar')
    })

    test('basicAuth', () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest
            .fn()
            .mockReturnValueOnce('admin')
            .mockReturnValueOnce('P@ssw0rd')
            .mockImplementation(param => param)
        }
      }
      Given.basicAuth.call($this, 'admin', 'password')
      expect($this.api.request.setHeader.mock.calls.length).toBe(1)
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe('authorization')
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe('Basic YWRtaW46UEBzc3cwcmQ=')
      expect($this.data.get.mock.calls.length).toBe(3)
      expect($this.data.get.mock.calls[0][0]).toBe('admin')
      expect($this.data.get.mock.calls[1][0]).toBe('password')
    })
  })

  describe('Request query string Functions', () => {
    test('queryString', () => {
      const $this = {
        api: {
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
      const $this = {
        api: {
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

      const table = {
        raw: () => {
          return [
            ['param1', 'foo'],
            ['param2', 'bar']
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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
      const $this = {
        api: {
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

      const table = {
        raw: () => {
          return [
            ['param.foo1', 'foo'],
            ['param.foo2', 'bar']
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

    test('jsonPayload', () => {
      const $this = {
        api: {
          request: {
            setPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn(_ => {
            return _ 
          })
        }
      }

      const json = `
        {
          "foo": "bar"
        }
      `

      Given.jsonPayload.call($this, json)
      expect($this.api.request.setPayload.mock.calls.length).toBe(1)
      expect($this.api.request.setPayload.mock.calls[0][0]).toEqual(JSON.parse(json))
      expect($this.data.get.mock.calls.length).toBe(1)
    })
  })

  describe('Request body Form Functions', () => {
    test('form', () => {
      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue('bar1')
        }
      }
      Given.form.call($this, 'param1', 'bar')
      expect($this.api.request.addFormField.mock.calls.length).toBe(1)
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe('param1')
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe('bar1')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('bar')
    })

    test('formUpload', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.createReadStream = jest.fn().mockReturnValue('testFile.rs')

      const Given = require('./functions')

      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockImplementation(param => param),
          getFile: jest.fn().mockReturnValue('/usr/src/app/bar.png')
        }
      }
      Given.formUpload.call($this, 'file', 'bar.png')
      expect($this.api.request.addFormField.mock.calls.length).toBe(1)
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe('file')
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe('testFile.rs')
      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('bar.png')
      expect($this.data.getFile.mock.calls.length).toBe(1)
      expect($this.data.getFile.mock.calls[0][0]).toBe('bar.png')
      expect(fs.createReadStream.mock.calls.length).toBe(1)
      expect(fs.createReadStream.mock.calls[0][0]).toBe('/usr/src/app/bar.png')
    })

    test('forms', () => {
      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn(_ => {
            return _ + '123'
          })
        }
      }

      const table = {
        raw: () => {
          return [
            ['param.foo1', 'foo'],
            ['param.foo2', 'bar']
          ]
        }
      }
      Given.forms.call($this, table)
      expect($this.api.request.addFormField.mock.calls.length).toBe(2)
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe('param.foo1')
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe('foo123')
      expect($this.api.request.addFormField.mock.calls[1][0]).toBe('param.foo2')
      expect($this.api.request.addFormField.mock.calls[1][1]).toBe('bar123')
      expect($this.data.get.mock.calls.length).toBe(2)
      expect($this.data.get.mock.calls[0][0]).toBe('foo')
      expect($this.data.get.mock.calls[1][0]).toBe('bar')
    })
  })
})
