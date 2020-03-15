const assert = require('assert')
const dot = require('dot-object')

const Then = {}

Then.httpCode = function (code) {
  assert.equal(this.api.response.statusCode, code)
}

Then.httpTiming = function (timeMs) {
  var responseTime = Math.round(this.api.response.timing)
  assert.ok(responseTime < timeMs)
}

Then.headers = function (table) {
  table.raw().forEach(([key, value]) => {
    assert.equal(this.api.response.findInHeader(key), value)
  })
}

Then.headerValueIsExist = function (property) {
  assert.notEqual(this.api.response.findInHeader(property), undefined)
}

Then.headerValueIsNotExist = function (property) {
  assert.equal(this.api.response.findInHeader(property), undefined)
}

Then.shouldBeEmptyArrayResponse = function () {
  assert.equal(this.api.response.body.length, 0)
}

Then.shouldBeEmptyResponse = function () {
  assert.equal(this.api.response.body, undefined)
}

Then.shouldBeString = function (property, value) {
  value = this.apis.notebook.get(value)
  if (value == 'true') {
    assert.equal(this.api.response.findInBody(property), true)
  } else if (value == 'false') {
    assert.equal(this.api.response.findInBody(property), false)
  } else if (value == 'null') {
    assert.equal(this.api.response.findInBody(property), null)
  } else if (value == 'undefined') {
    assert.equal(undefined)
  } else {
    let foundInBody = this.api.response.findInBody(property)
    //let matched = foundInBody.match(/^(\d*\.)?\d+$/igm);
    if (typeof foundInBody == 'string') {
      assert.equal(
        String(foundInBody).replace(/X/g, 'x'),
        value.replace(/X/g, 'x')
      )
    } else {
      assert.equal(foundInBody, value)
    }
  }
}

Then.shouldBeNumber = function (property, value) {
  assert.equal(this.api.response.findInBody(property), Number(value))
}

Then.shouldBeTrue = function (property) {
  assert.equal(this.api.response.findInBody(property), true)
}

Then.shouldBeFalse = function (property) {
  assert.equal(this.api.response.findInBody(property), false)
}

Then.shouldBeNull = function (property) {
  assert.equal(this.api.response.findInBody(property), null)
}

Then.shouldBeEmpty = function (property) {
  assert.equal(this.api.response.findInBody(property), '')
}

Then.shouldBeNow = function (property) {
  const val = this.api.response.findInBody(property)
  const diff = Date.now() - new Date(val).getTime()
  assert.ok(diff < 60000)
}

Then.shouldMatch = function (property, value) {
  let val = this.api.response.findInBody(property)
  if (val == undefined) {
    val = ''
  }
  regex1 = new RegExp(value)
  assert.ok(regex1.test(val))
}

Then.shouldBeArraySize = function (value) {
  assert.equal(this.api.response.body.length, value)
}

Then.shouldNotBeNull = function (property) {
  let val = this.api.response.findInBody(property)
  assert.notEqual(val, undefined)
}

Then.headerValueShouldBeString = function (header, value) {
  assert.equal(this.api.response.findInHeader(header), value)
}

module.exports = Then
