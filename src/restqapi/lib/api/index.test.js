beforeEach(() => {
  jest.resetModules()
})

describe('# api - Module', () => {
  test('init', () => {
    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }
    const instance = new Api(options)

    expect(Object.keys(instance)).toHaveLength(5)
    expect(Object.keys(instance)).toEqual(['config', 'request', 'response', 'run', 'toJSON'])
    expect(instance.config).toEqual({ url: 'http://test.com' })
    expect(instance.request).toBeInstanceOf(Object)
    expect(instance.response).toBeNull()
    expect(instance.run).toBeInstanceOf(Function)
  })

  test('run - successfull call', async () => {
    jest.mock('./request', () => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    const got = require('got')
    jest.mock('got', () => {
      return jest.fn().mockResolvedValue({
        restqa: {
          statusCode: 201
        }
      })
    })

    const Response = require('./response')
    jest.mock('./response', () => {
      return jest.fn().mockReturnValue({
        status: 201
      })
    })

    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }

    const instance = new Api(options)
    await instance.run()

    expect(got.mock.calls).toHaveLength(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(Response.mock.calls).toHaveLength(1)
    expect(Response.mock.calls[0][0]).toEqual({ statusCode: 201 })
    expect(instance.response).toEqual({ status: 201 })
  })

  test('run - successfull call But api response is not a 2XX', async () => {
    jest.mock('./request', () => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    const got = require('got')
    jest.mock('got', () => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      })
    })

    const Response = require('./response')
    jest.mock('./response', () => {
      return jest.fn().mockReturnValue({
        status: 401
      })
    })

    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }

    const instance = new Api(options)
    await instance.run()

    expect(got.mock.calls).toHaveLength(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(Response.mock.calls).toHaveLength(1)
    expect(Response.mock.calls[0][0]).toEqual({ statusCode: 401 })
    expect(instance.response).toEqual({ status: 401 })
  })

  test('run - unsuccessfull call (random error)', async () => {
    jest.mock('./request', () => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    const got = require('got')
    jest.mock('got', () => {
      return jest.fn().mockRejectedValue(new Error('Random error'))
    })

    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }

    const instance = new Api(options)
    await expect(instance.run()).rejects.toThrow('Random error')

    expect(got.mock.calls).toHaveLength(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(instance.response).toBeNull()
  })

  test('toJson', async () => {
    jest.mock('./request', () => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    const got = require('got')
    jest.mock('got', () => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      })
    })

    jest.mock('./response', () => {
      return jest.fn().mockReturnValue({
        status: 401,
        getResult: () => {
          return {
            'my-result': '123'
          }
        }
      })
    })

    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }

    const instance = new Api(options)
    await instance.run()
    const result = instance.toJSON()

    expect(got.mock.calls).toHaveLength(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(result).toEqual({
      request: {
        foo: 'bar'
      },
      response: {
        'my-result': '123'
      }
    })
  })

  test('toJson when throw Error', async () => {
    jest.mock('./request', () => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    const got = require('got')
    jest.mock('got', () => {
      return jest.fn().mockRejectedValue(new Error('the error'))
    })

    const Api = require('./index')
    const options = {
      config: {
        url: 'http://test.com'
      }
    }

    const instance = new Api(options)
    await expect(instance.run()).rejects.toThrow('the error')
    const result = instance.toJSON()

    expect(got.mock.calls).toHaveLength(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(result).toEqual({
      request: {
        foo: 'bar'
      },
      response: null,
      error: 'the error'
    })
  })
})
