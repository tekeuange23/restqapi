beforeEach(() => {
  jest.resetModules()
})

describe('# world', () => {
  describe('setup - createApi', () => {
    test('createApi without given url', () => {
      const Lib = require('./lib')

      jest.mock('./lib')
      Lib.Api = jest.fn()

      const World = require('./world')

      const world = new World({})
      expect(world.apis.length).toBe(0)
      expect(typeof world.createApi).toBe('function')

      const config = {
        foo: 'bar'
      }

      world.setConfig(config)
      world.createApi()

      expect(world.apis.length).toBe(1)
      expect(Lib.Api.mock.calls[0][0]).toEqual({ config })
    })

    test('createApi with given url', () => {
      const Lib = require('./lib')

      jest.mock('./lib')
      Lib.Api = jest.fn()

      const World = require('./world')

      const world = new World({})
      expect(world.apis.length).toBe(0)

      const config = {
        foo: 'bar'
      }

      world.setConfig(config)
      world.createApi('https://example.test')

      expect(world.apis.length).toBe(1)
      const expectedConfig = {
        foo: 'bar',
        url: 'https://example.test'
      }
      expect(Lib.Api.mock.calls[0][0]).toEqual({ config: expectedConfig })
    })
  })
})
