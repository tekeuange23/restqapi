afterEach(() => {
  jest.resetModules()
})

describe('# restqapi', () => {
  test('setSteps', () => {
    const Restqapi = require('./index')

    const instance = new Restqapi({
      data: {
        startSymbol: '[[',
        endSymbol: ']]'
      }
    })

    const Definitions = {
      Given: jest.fn(),
      When: jest.fn(),
      Then: jest.fn()
    }
    instance.setSteps(Definitions)

    expect(Definitions.Given).toHaveBeenCalled()
    expect(Definitions.When).toHaveBeenCalled()
    expect(Definitions.Then).toHaveBeenCalled()
  })

  test('setHooks', () => {
    const Hooks = require('./hooks')
    jest.mock('./hooks')
    Hooks.mockReturnValue(1)

    const Restqapi = require('./index')

    const instance = new Restqapi({ a: 'b' })
    instance.setHooks({ foo: 'bar' })

    expect(Hooks.mock.calls.length).toBe(1)
    const expectedConfig = {
      a: 'b',
      data: {
        startSymbol: '{{',
        endSymbol: '}}'
      }
    }
    expect(Hooks.mock.calls[0][0]).toEqual(expectedConfig)
    expect(Hooks.mock.calls[0][1]).toEqual({ foo: 'bar' })
  })

  test('getWorld', () => {
    const World = require('./world')
    jest.mock('./world')

    const Restqapi = require('./index')

    const instance = new Restqapi({ a: 'b' })
    const world = instance.getWorld()

    expect(world).toEqual(World)
  })

  test('setWorld', () => {
    const Restqapi = require('./index')

    const newWorld = 'my-world'
    const instance = new Restqapi({ a: 'b' })
    instance.setWorld(newWorld)
    const world = instance.getWorld()

    expect(world).toEqual('my-world')
  })

  test('setParameterType', () => {
    const Restqapi = require('./index')
    const defineParameterType = jest.fn()

    const instance = new Restqapi({ a: 'b' })
    instance.setParameterType(defineParameterType)

    expect(defineParameterType.mock.calls.length).toBe(1)
    expect(defineParameterType.mock.calls[0][0].regexp).toEqual(/\{\{(.*)\}\}/)
    expect(defineParameterType.mock.calls[0][0].name).toEqual('data')
    expect(typeof defineParameterType.mock.calls[0][0].transformer).toEqual('function')

    // test the transformer
    const $this = {
      data: {
        get: jest.fn()
      }
    }
    defineParameterType.mock.calls[0][0].transformer.call($this, 'my-data')
    expect($this.data.get.mock.calls.length).toBe(1)
    expect($this.data.get.mock.calls[0][0]).toBe('{{ my-data }}')
  })
})


describe('# restqapi.generate', () => {
  test('throw an error if the parameter is empty', () =>{
    const Restqapi = require('./index')
    expect(Restqapi.generate()).rejects.toThrow(new ReferenceError('Please provide an object containing your request'));
  })

  test('throw an error if the object doesn\'t contains the url', () =>{
    const Restqapi = require('./index')
    const query = {

    }
    expect(Restqapi.generate(query)).rejects.toThrow(new ReferenceError('Please specify your url'));
  })

  test('throw an error if the method is not valid', () =>{
    const Restqapi = require('./index')
    const query = {
      url: 'http://www.example.com',
      method: 'PUUT'
    }
    expect(Restqapi.generate(query)).rejects.toThrow(new TypeError('The method "PUUT" is not valid, please use : GET, POST, PUT, PATCH, DELETE, OPTIONS or HEAD'));

  })

  test('Use method get if it\'s not specified', async () => {
    const got = require('got')
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: '/'
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          'content-type': 'application/json'
        },
        body: {
          foo: 'bar',
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null
        }
      }
    })
    jest.mock('got')
    const Restqapi = require('./index')
    const query = {
      url: 'http://www.example.com'
    }
    const result = await Restqapi.generate(query)
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body at "foo" should equal "bar"
  And the response body at "number" should equal 12
  And the response body at "booTrue" should equal true
  And the response body at "booFalse" should equal false
  And the response body at "null" should equal null
`
    expect(result).toEqual(expectedResult.trim())

    const expectedOptions = {
      pathname: '/',
      method: 'GET',
      protocol: 'http:',
      hostname: 'www.example.com'
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expect.objectContaining(expectedOptions))
  })

  test('Get scenario with multiple level on the response body', async () => {
    const got = require('got')
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: '/'
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          'content-type': 'application/json'
        },
        body: {
          foo: 'bar',
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null,
          items: [{
            hello: 'world',
            bonjour: 'le monde'
          }],
          '0': 'zero',
        }
      }
    })
    jest.mock('got')
    const Restqapi = require('./index')
    const query = {
      url: 'http://www.example.com'
    }
    const result = await Restqapi.generate(query)
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body at "0" should equal "zero"
  And the response body at "foo" should equal "bar"
  And the response body at "number" should equal 12
  And the response body at "booTrue" should equal true
  And the response body at "booFalse" should equal false
  And the response body at "null" should equal null
  And the response body at "items" should be an array
  And the response body at "items" should be an array of 1 item(s)
  And the response body at "items.0.hello" should equal "world"
  And the response body at "items.0.bonjour" should equal "le monde"
`
    expect(result).toEqual(expectedResult.trim())

    const expectedOptions = {
      pathname: '/',
      method: 'GET',
      protocol: 'http:',
      hostname: 'www.example.com'
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expect.objectContaining(expectedOptions))
  })

  test.skip('Get scenario with an array as a response body', async () => {
    const got = require('got')
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: '/'
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          'content-type': 'application/json'
        },
        body: [{
          hello: 'world'
        }, {
          bonjour: 'le monde',
          items: [{
            foo: 'bar'
          }]
        }]
      }
    })
    jest.mock('got')
    const Restqapi = require('./index')
    const query = {
      url: 'http://www.example.com'
    }
    const result = await Restqapi.generate(query)
    console.log(result)
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response list should contain 2 item(s)
  And the response body at "0.hello" should equal "world"
  And the response body at "1.bonjour" should equal "le monde"
  And the response body at "1.items" should be an array
  And the response body at "1.items" should be an array of 1 item(s)
  And the response body at "1.items" should be an array
  And the response body at "1.items" should be an array of 1 item(s)
  And the response body at "1.items.0.foo" should equal "bar"
`
    expect(result).toEqual(expectedResult.trim())

    const expectedOptions = {
      pathname: '/',
      method: 'GET',
      protocol: 'http:',
      hostname: 'www.example.com'
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expect.objectContaining(expectedOptions))
  })
})
