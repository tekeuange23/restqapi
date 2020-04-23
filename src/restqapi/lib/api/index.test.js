beforeEach(() => {
  jest.resetModules()
})

describe('# api - Module', () => {
  test('init', () => {
    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }
    let instance = new Api(options)
    
    expect(Object.keys(instance).length).toBe(5)
    expect(Object.keys(instance)).toEqual(['config', 'request', 'response', 'run', 'toJSON'])
    expect(instance.config).toEqual({ url: 'http://test.com' })
    expect(instance.request).toBeInstanceOf(Object)
    expect(instance.response).toEqual(null)
    expect(instance.run).toBeInstanceOf(Function)
  })

  test('run - successfull call', async () => {

    let Request = require('./request')
    jest.mock('./request',() => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    let got = require('got')
    jest.mock('got',() => {
      return jest.fn().mockResolvedValue({
        restqa: {
          statusCode: 201
        }
      })
    })

    let Response = require('./response')
    jest.mock('./response', () => {
        return jest.fn().mockReturnValue({
          status: 201
        })
    })

    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }

    let instance = new Api(options)
    await instance.run()


    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(Response.mock.calls.length).toBe(1)
    expect(Response.mock.calls[0][0]).toEqual({ statusCode: 201 })
    expect(instance.response).toEqual({ status: 201 })

  })

  test('run - successfull call But api response is not a 2XX', async () => {

    let Request = require('./request')
    jest.mock('./request',() => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    let got = require('got')
    jest.mock('got',() => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      })
    })

    let Response = require('./response')
    jest.mock('./response', () => {
      return jest.fn().mockReturnValue({
        status: 401
      })
    })

    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }

    let instance = new Api(options)
    await instance.run()

    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(Response.mock.calls.length).toBe(1)
    expect(Response.mock.calls[0][0]).toEqual({ statusCode: 401 })
    expect(instance.response).toEqual({ status: 401 })
  })

  test('run - unsuccessfull call (random error)', async () => {

    let Request = require('./request')
    jest.mock('./request',() => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    let got = require('got')
    jest.mock('got',() => {
      return jest.fn().mockRejectedValue(new Error('Random error'))
    })

    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }

    
    let instance = new Api(options)
    await expect(instance.run()).rejects.toThrow('Random error')

    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual({ foo: 'bar' })

    expect(instance.response).toEqual(null)
  })

  test('toJson', async () => {

    let Request = require('./request')
    jest.mock('./request',() => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    let got = require('got')
    jest.mock('got',() => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      })
    })

    let Response = require('./response')
    jest.mock('./response', () => {
      return jest.fn().mockReturnValue({
        status: 401,
        getResult: () => {
          return  {
            'my-result': '123'
          }
        }
      })
    })

    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }

    let instance = new Api(options)
    await instance.run()
    let result = instance.toJSON()

    expect(got.mock.calls.length).toBe(1)
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

    let Request = require('./request')
    jest.mock('./request',() => {
      return jest.fn().mockImplementation(() => {
        return {
          getOptions: jest.fn(() => {
            return { foo: 'bar' }
          })
        }
      })
    })

    let got = require('got')
    jest.mock('got',() => {
      return jest.fn().mockRejectedValue(new Error('the error'))
    })

    let Api = require('./index')
    let options = {
      config: {
        url: 'http://test.com'
      }
    }

    let instance = new Api(options)
    await expect(instance.run()).rejects.toThrow('the error')
    let result = instance.toJSON()

    expect(got.mock.calls.length).toBe(1)
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


