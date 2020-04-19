describe('#StepDefinition - given - functions', () => {

  const When = require('./functions')

  test('Configuration', () => {
    let fns  = Object.keys(When)
    expect(fns.length).toBe(1)
    let expectedFunctions = [
      'callApi',
    ]
    expect(fns).toEqual(expectedFunctions)
  })

  describe('Default Functions', () => {
    test('callApi', () => {
      let $this = {
        api: {
          run: jest.fn().mockResolvedValue(true)
        }
      }
      When.callApi.call($this)
      expect($this.api.run.mock.calls.length).toBe(1)
      expect($this.api.run.mock.calls[0][0]).toBeUndefined()
    })
  })
})

