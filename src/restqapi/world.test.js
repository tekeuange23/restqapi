beforeEach(() => {
  jest.resetModules()
})

describe('# world', () => {
  test('constructors', () => {
    const World = require('./world')

    const world = new World({ attach: 'attach', parameters: 'parameters' })

    expect(world.skipped).toBe(false)
    expect(world.attach).toEqual('attach')
    expect(world.parameters).toEqual('parameters')
    expect(world._config).toEqual({})
    expect(world._apis).toEqual([])
    expect(world._data).toBeNull()
  })

  test('setConfig without secret', () => {
    const Lib = require('./lib')
    jest.mock('./lib')
    Lib.Data = jest.fn(() => {
      return {
        set: jest.fn()
      }
    })

    const World = require('./world')

    const world = new World({})
    world.setConfig({ foo: 'bar', data: {} })

    expect(world._config).toEqual({ foo: 'bar', data: {} })
    expect(world._data).not.toBeNull()
    expect(world._data.set.mock.calls.length).toBe(0)
  })

  test('setConfig with secret', () => {
    const Lib = require('./lib')
    jest.mock('./lib')
    Lib.Data = jest.fn(() => {
      return {
        set: jest.fn()
      }
    })

    const World = require('./world')

    const world = new World({})
    const config = {
      foo: 'bar',
      data: {},
      secrets: {
        so: 'blur'
      }
    }
    world.setConfig(config)

    expect(world.getConfig()).toEqual(config)
    expect(world.data).not.toBeNull()
    expect(world.data.set.mock.calls.length).toBe(1)
    expect(world.data.set.mock.calls[0][0]).toBe('so')
    expect(world.data.set.mock.calls[0][1]).toBe('blur')
  })

  describe('createApi', () => {
    test('createApi without given url', () => {
      const Lib = require('./lib')

      jest.mock('./lib')
      Lib.Api = jest.fn()

      const World = require('./world')

      const world = new World({})
      expect(world._apis.length).toBe(0)

      const config = {
        foo: 'bar'
      }

      world.setConfig(config)
      world.createApi()

      expect(world._apis.length).toBe(1)
      expect(world.apis.length).toBe(1)
      expect(Lib.Api.mock.calls[0][0]).toEqual({ config })
    })

    test('createApi with given url', () => {
      const Lib = require('./lib')

      jest.mock('./lib')
      Lib.Api = jest.fn()

      const World = require('./world')

      const world = new World({})
      expect(world._apis.length).toBe(0)

      const config = {
        foo: 'bar'
      }

      world.setConfig(config)
      world.createApi('https://example.test')

      expect(world._apis.length).toBe(1)
      expect(world.apis.length).toBe(1)
      const expectedConfig = {
        foo: 'bar',
        url: 'https://example.test'
      }
      expect(Lib.Api.mock.calls[0][0]).toEqual({ config: expectedConfig })
    })
  })
})
