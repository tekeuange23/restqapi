const fs = require('fs')
const path = require('path')
const os = require('os')
const Request = require('./api/request')
const YAML = require('yaml')

let tmpFiles = []

beforeEach(() => {
  tmpFiles.forEach(file => fs.existsSync(file) && fs.unlinkSync(file))
  tmpFiles = []
})

afterEach(() => {
  jest.resetModules()
  tmpFiles.forEach(file => fs.existsSync(file) && fs.unlinkSync(file))
  tmpFiles = []
})

describe('#lib - performance', () => {
  test('throw an error if the configuration doesn\'t contains the type', () => {
    const Performance = require('./performance')
    expect(() => Performance({})).toThrow('The performance property "type" should be specify. (available: artillery)')
  })

  describe('add scenario', () => {
    test('Do not add the scenario into if the apis is empty', () => {
      const config = {
        type: 'artillery'
      }
      const Performance = require('./performance')(config)

      expect(Performance.add([])).toBe(false)
      expect(Performance.features).toEqual({})
    })

    test('Do not add the scenario into if the result of the scenario is not passed', () => {
      const config = {
        type: 'artillery'
      }
      const Performance = require('./performance')(config)
      const api = {
        request: {},
        response: {}
      }

      const scenario = {
        result: {
          duration: 1001000000,
          exception: {
            actual: 201,
            code: 'ERR_ASSERTION',
            expected: 200,
            generatedMessage: false,
            operator: 'strictEqual'
          },
          status: 'failed'
        },
        sourceLocation: {
          line: 4,
          uri: 'example/features/users.api.feature'
        }
      }
      expect(Performance.add([api], scenario)).toBe(false)
      expect(Performance.features).toEqual({})
    })

    test('add the scenario if the passed', () => {
      const config = {
        type: 'artillery'
      }
      const Performance = require('./performance')(config)
      const apis = [
        { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
      ]

      const scenario = {
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
      expect(Performance.add(apis, scenario)).toBe(true)
      const expectedScenarios = {
        'users.api.yml': [{
          apis,
          scenario
        }]
      }
      expect(Performance.features).toEqual(expectedScenarios)
    })
  })

  describe('print scenarios', () => {
    describe('artillery format', () => {
      test('print into specific file (method + url)', () => {
        const apis = [
          { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
        ]
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

        const config = {
          type: 'artillery',
          outputFolder: path.resolve(os.tmpdir(), 'perf')
        }
        tmpFiles.push(path.join(config.outputFolder, 'users.api.yml'))
        const Performance = require('./performance')(config)
        Performance.add(apis, scenario)
        Performance.print()
        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              get: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                }
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)
      })

      test('print into specific file (method + url + headers)', () => {
        const apis = [
          { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
        ]
        apis[0].request.setHeader('x-foo', 'bar')
        apis[0].request.setHeader('cookie', undefined)
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

        const config = {
          type: 'artillery',
          outputFolder: path.resolve(os.tmpdir(), 'perf')
        }
        tmpFiles.push(path.join(config.outputFolder, 'users.api.yml'))
        const Performance = require('./performance')(config)
        Performance.add(apis, scenario)
        Performance.print()
        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              get: {
                url: '/',
                headers: {
                  'x-foo': 'bar',
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                }
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)
      })

      test('print into specific file (method + url + query string)', () => {
        const apis = [
          { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
        ]
        apis[0].request.setQueryString('filter', 'title')
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

        const config = {
          type: 'artillery',
          outputFolder: path.resolve(os.tmpdir(), 'perf')
        }
        tmpFiles.push(path.join(config.outputFolder, 'users.api.yml'))
        const Performance = require('./performance')(config)
        Performance.add(apis, scenario)
        Performance.print()
        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              get: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                },
                qs: {
                  filter: 'title'
                }
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)
      })

      test('print into specific file (method + url + json body)', () => {
        const apis = [
          { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
        ]
        apis[0].request.addPayload('type', 'user')
        apis[0].request.addPayload('person.firstName', 'john')
        apis[0].request.addPayload('person.lastName', 'doe')
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

        const config = {
          type: 'artillery',
          outputFolder: path.resolve(os.tmpdir(), 'perf')
        }
        tmpFiles.push(path.join(config.outputFolder, 'users.api.yml'))
        const Performance = require('./performance')(config)
        Performance.add(apis, scenario)
        Performance.print()
        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              get: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                },
                json: {
                  type: 'user',
                  person: {
                    firstName: 'john',
                    lastName: 'doe'
                  }
                }
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)
      })

      test('print into specific file (method + url + form body)', () => {
        const apis = [
          { request: Request('http://localhost', false, 'xx-yyy-zzzz') }
        ]
        apis[0].request.addFormField('type', 'user')
        apis[0].request.addFormField('firstName', 'john')
        apis[0].request.addFormField('lastName', 'doe')
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

        const config = {
          type: 'artillery',
          outputFolder: path.resolve(os.tmpdir(), 'perf')
        }
        tmpFiles.push(path.join(config.outputFolder, 'users.api.yml'))
        const Performance = require('./performance')(config)
        Performance.add(apis, scenario)
        Performance.print()
        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              get: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                },
                formData: {
                  type: 'user',
                  firstName: 'john',
                  lastName: 'doe'
                }
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)
      })
    })
  })
})
