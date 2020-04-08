const assert = require('assert')
const Then = {}

Then.httpCode = function (code) {
  assert.strictEqual(this.api.response.statusCode, code)
}

Then.httpTiming = function (timeMs) {
  var responseTime = Math.round(this.api.response.timing)
  assert.ok(responseTime < timeMs)
}

Then.headers = function (table) {
  table.raw().forEach(([key, value]) => {
    assert.strictEqual(this.api.response.findInHeader(key), value)
  })
}

Then.headerValueIsExist = function (property) {
  assert.notStrictEqual(this.api.response.findInHeader(property), undefined)
}

Then.headerValueIsNotExist = function (property) {
  assert.strictEqual(this.api.response.findInHeader(property), undefined)
}

Then.shouldBeEmptyArrayResponse = function () {
  assert.strictEqual(this.api.response.body.length, 0)
}

Then.shouldBeEmptyResponse = function () {
  assert.strictEqual(this.api.response.body, undefined)
}

Then.shouldBeString = function (property, value) {
  value = this.apis.notebook.get(value)
  if (value === 'true') {
    assert.strictEqual(this.api.response.findInBody(property), true)
  } else if (value === 'false') {
    assert.strictEqual(this.api.response.findInBody(property), false)
  } else if (value === 'null') {
    assert.strictEqual(this.api.response.findInBody(property), null)
  } else if (value === 'undefined') {
    assert.strictEqual(undefined)
  } else {
    const foundInBody = this.api.response.findInBody(property)
    // let matched = foundInBody.match(/^(\d*\.)?\d+$/igm);
    if (typeof foundInBody === 'string') {
      assert.strictEqual(
        String(foundInBody).replace(/X/g, 'x'),
        value.replace(/X/g, 'x')
      )
    } else {
      assert.strictEqual(foundInBody, value)
    }
  }
}

Then.shouldBeNumber = function (property, value) {
  assert.strictEqual(this.api.response.findInBody(property), Number(value))
}

Then.shouldBeTrue = function (property) {
  assert.strictEqual(this.api.response.findInBody(property), true)
}

Then.shouldBeFalse = function (property) {
  assert.strictEqual(this.api.response.findInBody(property), false)
}

Then.shouldBeNull = function (property) {
  assert.strictEqual(this.api.response.findInBody(property), null)
}

Then.shouldBeEmpty = function (property) {
  assert.strictEqual(this.api.response.findInBody(property), '')
}

Then.shouldBeNow = function (property) {
  const val = this.api.response.findInBody(property)
  const diff = Date.now() - new Date(val).getTime()
  assert.ok(diff < 60000)
}

Then.shouldMatch = function (property, value) {
  let val = this.api.response.findInBody(property)
  if (val === undefined) {
    val = ''
  }
  const regex1 = new RegExp(value)
  assert.ok(regex1.test(val))
}

Then.shouldBeArraySize = function (value) {
  assert.strictEqual(this.api.response.body.length, value)
}

Then.shouldNotBeNull = function (property) {
  const val = this.api.response.findInBody(property)
  assert.notStrictEqual(val, undefined)
}

Then.headerValueShouldBeString = function (header, value) {
  assert.strictEqual(this.api.response.findInHeader(header), value)
}

module.exports = Then
