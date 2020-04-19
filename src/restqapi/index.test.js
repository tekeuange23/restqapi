beforeEach(() => {
  jest.resetModules()
})

describe('# restqapi', () => {
  test('setSteps', () => {
    let Steps = require('./steps')
    jest.mock('./steps')
    Steps.mockReturnValue(1)

    let Restqapi = require('./index')

    let instance = new Restqapi({
      data: {
        startSymbol: '[[',
        endSymbol: ']]'
      }
    })
    instance.setSteps({foo: 'bar'})

    expect(Steps.mock.calls.length).toBe(1)
    expect(Steps.mock.calls[0][0]).toEqual({foo: 'bar'})
  })

  test('setHooks', () => {
    let Hooks = require('./hooks')
    jest.mock('./hooks')
    Hooks.mockReturnValue(1)

    let Restqapi = require('./index')

    let instance = new Restqapi({a: 'b'})
    instance.setHooks({foo: 'bar'})

    expect(Hooks.mock.calls.length).toBe(1)
    let expectedConfig = {
      a: 'b',
      data : {
        startSymbol: '{{',
        endSymbol: '}}',
      }
    }
    expect(Hooks.mock.calls[0][0]).toEqual(expectedConfig)
    expect(Hooks.mock.calls[0][1]).toEqual({foo: 'bar'})
  })

  test('getWorld', () => {
    let World = require('./world')
    jest.mock('./world')

    let Restqapi = require('./index')

    let instance = new Restqapi({a: 'b'})
    let world = instance.getWorld()

    expect(world).toEqual(World)
  })

  test('setWorld', () => {

    let Restqapi = require('./index')
    
    let newWorld = 'my-world'
    let instance = new Restqapi({a: 'b'})
    instance.setWorld(newWorld)
    let world = instance.getWorld()

    expect(world).toEqual('my-world')
  })

  test('setParameterType', () => {

    let Restqapi = require('./index')
    let defineParameterType = jest.fn()
    
    let instance = new Restqapi({a: 'b'})
    instance.setParameterType(defineParameterType)

    expect(defineParameterType.mock.calls.length).toBe(1)
    expect(defineParameterType.mock.calls[0][0].regexp).toEqual(/\{\{(.*)\}\}/)
    expect(defineParameterType.mock.calls[0][0].name).toEqual('data')
    expect(typeof defineParameterType.mock.calls[0][0].transformer).toEqual('function')

    // test the transformer
    let $this = {
      data: {
        get: jest.fn()
      }
    }
    defineParameterType.mock.calls[0][0].transformer.call($this, 'my-data')
    expect($this.data.get.mock.calls.length).toBe(1)
    expect($this.data.get.mock.calls[0][0]).toBe('{{ my-data }}')


  })
})
