const path = require('path')

beforeEach(() => {
  jest.resetModules()
})

describe('# hooks', () => {
  test('init', () => {
    const Hooks = require('./hooks')

    const $this = {
      debug: [
        'Simple Value',
        {
          foo: 'bar'
        }
      ],
      log: jest.fn(),
      attach: jest.fn(),
      setConfig: jest.fn(),
      data: {
        parse: jest.fn()
      },
      apis: [{
        toJSON: () => {
          return {
            foo: 'bar'
          }
        }
      }]
    }

    const config = {
      foo: 'bar',
      data: {}
    }

    const feature = {
      name: 'sc1',
      pickle: {
        name: 'The scenario name'
      }
    }

    const fns = {
      Before: jest.fn((...params) => {
        return params.pop().call($this, feature)
      }),
      BeforeAll: jest.fn(),
      After: jest.fn((...params) => {
        return params.pop().call($this, feature)
      }),
      AfterAll: jest.fn()
    }

    Hooks(config, fns)

    expect(fns.Before.mock.calls).toHaveLength(4)
    expect(typeof fns.Before.mock.calls[0][0]).toBe('function')
    expect($this.setConfig.mock.calls).toHaveLength(1)
    expect($this.setConfig.mock.calls[0][0]).toEqual({ data: {}, foo: 'bar' })
    expect($this.data.parse.mock.calls).toHaveLength(1)
    expect($this.data.parse.mock.calls[0][0]).toEqual(feature)

    expect(fns.Before.mock.calls[1][0]).toBe('@skip')
    expect(typeof fns.Before.mock.calls[1][1]).toBe('function')
    expect(fns.Before.mock.results[1].value).toBe('skipped')

    expect(fns.Before.mock.calls[2][0]).toBe('@wip')
    expect(typeof fns.Before.mock.calls[2][1]).toBe('function')
    expect(fns.Before.mock.results[2].value).toBe('skipped')

    expect(fns.Before.mock.calls[3][0]).toBe('@insecure')
    expect(typeof fns.Before.mock.calls[3][1]).toBe('function')
    expect($this.insecure).toBe(true)

    expect(fns.BeforeAll.mock.calls).toHaveLength(0)

    expect(fns.After.mock.calls).toHaveLength(1)
    expect(typeof fns.After.mock.calls[0][0]).toBe('function')

    expect($this.log.mock.calls).toHaveLength(4)
    expect($this.log.mock.calls[0][0]).toBe('\n======================== [ DEBUG : The scenario name ] ========================')
    expect($this.log.mock.calls[1][0]).toBe('Simple Value')
    expect($this.log.mock.calls[2][0]).toBe(JSON.stringify({ foo: 'bar' }, null, 2))
    expect($this.log.mock.calls[3][0]).toBe('======================== [ / DEBUG ] ========================')
    expect($this.attach.mock.calls).toHaveLength(1)
    const expectedAttachement = JSON.stringify({
      apis: [
        { foo: 'bar' }
      ]
    })
    expect($this.attach.mock.calls[0][0]).toEqual(expectedAttachement)
    expect($this.attach.mock.calls[0][1]).toEqual('application/json')

    expect(fns.AfterAll.mock.calls).toHaveLength(0)

    expect($this.skipped).toEqual(true)
  })

  test('init with performance config', () => {
    const Hooks = require('./hooks')

    const $this = {
      debug: [
        'Simple Value',
        {
          foo: 'bar'
        }
      ],
      log: jest.fn(),
      attach: jest.fn(),
      setConfig: jest.fn(),
      data: {
        parse: jest.fn()
      },
      apis: [{
        toJSON: () => {
          return {
            foo: 'bar'
          }
        }
      }]
    }

    const config = {
      foo: 'bar',
      data: {},
      performance: {
        type: 'artillery'
      }
    }

    const scenario = {
      pickle: {
        language: 'en',
        locations: [{
          column: 1,
          line: 4
        }],
        name: 'Successfull creation (no data variable)',
        steps: [{
          arguments: [],
          locations: [{
            column: 7,
            line: 5
          }],
          text: 'I have the api gateway'
        }]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: 'ERR_ASSERTION',
          expected: 200,
          generatedMessage: false,
          operator: 'strictEqual'
        },
        status: 'passed'
      },
      sourceLocation: {
        line: 4,
        uri: 'example/features/users.api.feature'
      }
    }

    const fns = {
      Before: jest.fn((...params) => {
        return params.pop().call($this, scenario)
      }),
      BeforeAll: jest.fn(),
      After: jest.fn((...params) => {
        return params.pop().call($this, scenario)
      }),
      AfterAll: jest.fn()
    }

    Hooks(config, fns)

    expect(fns.Before.mock.calls).toHaveLength(4)
    expect(typeof fns.Before.mock.calls[0][0]).toBe('function')
    expect($this.setConfig.mock.calls).toHaveLength(1)
    expect($this.setConfig.mock.calls[0][0]).toEqual({
      data: {},
      foo: 'bar',
      performance: {
        type: 'artillery',
        outputFolder: path.resolve(process.cwd(), 'tests', 'performance')
      }
    })
    expect($this.data.parse.mock.calls).toHaveLength(1)
    expect($this.data.parse.mock.calls[0][0]).toEqual(scenario)

    expect(fns.Before.mock.calls[1][0]).toBe('@skip')
    expect(typeof fns.Before.mock.calls[1][1]).toBe('function')
    expect(fns.Before.mock.results[1].value).toBe('skipped')

    expect(fns.Before.mock.calls[2][0]).toBe('@wip')
    expect(typeof fns.Before.mock.calls[2][1]).toBe('function')
    expect(fns.Before.mock.results[2].value).toBe('skipped')

    expect(fns.Before.mock.calls[3][0]).toBe('@insecure')
    expect(typeof fns.Before.mock.calls[3][1]).toBe('function')
    expect($this.insecure).toBe(true)

    expect(fns.BeforeAll.mock.calls).toHaveLength(0)

    expect(fns.After.mock.calls).toHaveLength(2)
    expect(fns.After.mock.calls[0][0]).toBe('@performance')
    expect(typeof fns.After.mock.calls[0][1]).toBe('function')
    expect(typeof fns.After.mock.calls[1][0]).toBe('function')

    expect(fns.AfterAll.mock.calls).toHaveLength(1)
    expect(typeof fns.AfterAll.mock.calls[0][0]).toBe('function')

    expect($this.log.mock.calls).toHaveLength(4)
    expect($this.log.mock.calls[0][0]).toBe('\n======================== [ DEBUG : Successfull creation (no data variable) ] ========================')
    expect($this.log.mock.calls[1][0]).toBe('Simple Value')
    expect($this.log.mock.calls[2][0]).toBe(JSON.stringify({ foo: 'bar' }, null, 2))
    expect($this.log.mock.calls[3][0]).toBe('======================== [ / DEBUG ] ========================')
    expect($this.attach.mock.calls).toHaveLength(1)
    const expectedAttachement = JSON.stringify({
      apis: [
        { foo: 'bar' }
      ]
    })
    expect($this.attach.mock.calls[0][0]).toEqual(expectedAttachement)
    expect($this.attach.mock.calls[0][1]).toEqual('application/json')

    expect($this.skipped).toEqual(true)
  })

  test('init without Data', () => {
    const Hooks = require('./hooks')

    const $this = {
      attach: jest.fn(),
      setConfig: jest.fn(),
      debug: [],
      data: {
        parse: jest.fn()
      },
      apis: [{
        toJSON: () => {
          return {
            foo: 'bar'
          }
        }
      }]
    }

    const config = {
      foo: 'bar'
    }
    const fns = {
      Before: jest.fn((...params) => {
        return params.pop().call($this, { name: 'sc1' })
      }),
      After: jest.fn((...params) => {
        return params.pop().call($this, { name: 'sc1' })
      })
    }

    Hooks(config, fns)

    expect(fns.Before.mock.calls).toHaveLength(4)
    expect(typeof fns.Before.mock.calls[0][0]).toBe('function')
    expect($this.setConfig.mock.calls).toHaveLength(1)
    expect($this.setConfig.mock.calls[0][0]).toEqual({ foo: 'bar' })
    expect($this.data.parse.mock.calls).toHaveLength(0)
    expect($this.debug).toEqual([])
  })
})
