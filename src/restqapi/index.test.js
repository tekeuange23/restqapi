const RestQAPI = require('./index')
const Request = require('./lib/api/request')
const Response = require('./lib/api/response')
const path = require('path')
const os = require('os')
const fs = require('fs')
const YAML = require('yaml')

afterEach(() => {
  jest.resetModules()
})

describe('#restqapi - index', () => {
  test('name', () => {
    expect(RestQAPI.name).toEqual('restqapi')
  })

  test('steps', () => {
    expect(RestQAPI.steps.given).not.toHaveLength(0)
    expect(RestQAPI.steps.when).not.toHaveLength(0)
    expect(RestQAPI.steps.then).not.toHaveLength(0)
  })

  describe('hooks', () => {
    test('before', () => {
      const scenario = {
        pickle: {
          tags: []
        }
      }

      const $this = {
        getConfig: jest.fn().mockReturnValue({
          url: 'https://example.com'
        })
      }

      RestQAPI.hooks.before.call($this, scenario)
      expect($this.apis).toHaveLength(0)
      expect($this.createApi).not.toBeUndefined()
      $this.createApi()
      expect($this.apis).toHaveLength(1)
      expect($this.apis[0].config.url).toBe('https://example.com')

      $this.createApi('https://example.dev')
      expect($this.apis).toHaveLength(2)
      expect($this.apis[1].config.url).toBe('https://example.dev')
    })

    test('before with insecure tag', () => {
      const scenario = {
        pickle: {
          tags: [{
            name: '@insecure',
            astNodeId: 'faf08f9e-f046-4fcf-b974-70fd5bf30598'
          }]
        }
      }
      const $this = {
        getConfig: jest.fn().mockReturnValue({
          url: 'https://example.com'
        })
      }

      RestQAPI.hooks.before.call($this, scenario)
      expect($this.apis).toHaveLength(0)
      expect($this.insecure).toBe(true)
      expect($this.createApi).not.toBeUndefined()
    })

    test('after', () => {
      const scenario = {
        name: 'sc1',
        pickle: {
          name: 'The scenario name',
          tags: []
        }
      }

      const $this = {
        debug: [
          'Simple Value',
          {
            foo: 'bar'
          }
        ],
        log: jest.fn(),
        attach: jest.fn(),
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

      RestQAPI.hooks.after.call($this, scenario)
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
    })

    describe('performance', () => {
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

      test('init with performance config', () => {
        const config = {
          url: 'https://example.com',
          performance: {
            tool: 'artillery',
            outputFolder: path.resolve(os.tmpdir(), 'perf'),
            onlySuccess: true
          }
        }

        const $this = {
          attach: jest.fn(),
          getConfig: jest.fn().mockReturnValue(config),
          apis: [{
            request: new Request('http://localhost', false, 'xx-yyy-zzzz'),
            response: Response({
              statusCode: 200,
              headers: {
                'content-type': 'application/json'
              }
            })
          }, {
            request: new Request('http://localhost', false, 'aa-bbb-ccc'),
            response: Response({
              statusCode: 404,
              headers: {
                'content-type': 'text/html'
              }
            })
          }]
        }
        $this.apis[0].request.setMethod('POST')
        $this.apis[0].request.addFormField('type', 'user')
        $this.apis[0].request.addFormField('firstName', 'john')
        $this.apis[0].request.addFormField('lastName', 'doe')

        tmpFiles.push(path.join(config.performance.outputFolder, 'account.api.yml'))

        const scenario = {
          pickle: {
            uri: 'example/features/account.api.feature',
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
          }
        }

        RestQAPI.hooks.performance.before.call($this, scenario)
        RestQAPI.hooks.performance.after.call($this, scenario)
        RestQAPI.hooks.afterAll.call(this)

        const expectedFile = {
          scenarios: [{
            name: 'Successfull creation (no data variable)',
            flow: [{
              post: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'xx-yyy-zzzz'
                },
                formData: {
                  type: 'user',
                  firstName: 'john',
                  lastName: 'doe'
                },
                expect: [
                  { statusCode: 200 },
                  { contentType: 'json' }
                ]
              }
            }, {
              get: {
                url: '/',
                headers: {
                  'user-agent': 'restqa (https://github.com/restqa/restqa)',
                  'x-correlation-id': 'aa-bbb-ccc'
                },
                expect: [
                  { statusCode: 404 },
                  { contentType: 'html' }
                ]
              }
            }]
          }]
        }

        expect(fs.existsSync(tmpFiles[0])).toBe(true)
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString('utf-8')
        expect(YAML.parse(generatedFile)).toEqual(expectedFile)

        expect($this.attach.mock.calls).toHaveLength(1)
        expect($this.attach.mock.calls[0][0]).toBe('Generate performance test scenario')
      })
    })
  })
})
