beforeEach(() => {
  jest.resetModules()
})

describe('#StepDefinition - index', () => {
  test('Configuration', () => {
    const fnGiven = require('./given')
    jest.mock('./given')
    fnGiven.push([1])

    const fnWhen = require('./when')
    jest.mock('./when')
    fnWhen.push([2])

    const fnThen = require('./then')
    jest.mock('./then')
    fnThen.push([3])

    const stepDefinition = require('./index')
    const obj = {
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
