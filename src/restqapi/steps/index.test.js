beforeEach(() => {
  jest.resetModules()
})

describe('#StepDefinition - index', () => {
  test('Configuration', () => {

    let fnGiven = require('./given')
    jest.mock('./given')
    fnGiven.push ([1])

    let fnWhen = require('./when')
    jest.mock('./when')
    fnWhen.push ([2])

    let fnThen = require('./then')
    jest.mock('./then')
    fnThen.push ([3])

    const stepDefinition = require('./index')
    let obj = {
      Given: jest.fn(),
      When: jest.fn(),
      Then: jest.fn()
    }

    stepDefinition(obj)

    expect(obj.Given.mock.calls.length).toBe(1)
    expect(obj.Given.mock.calls[0][0]).toEqual(1)
    expect(obj.When.mock.calls.length).toBe(1)
    expect(obj.When.mock.calls[0][0]).toEqual(2)
    expect(obj.Then.mock.calls.length).toBe(1)
    expect(obj.Then.mock.calls[0][0]).toEqual(3)
  })
})

