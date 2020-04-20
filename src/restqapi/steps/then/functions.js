const assert = require('assert')
const Then = {}

/*
 * =========================================
 * Response API Default Functions
 * =========================================
 */


Then.httpCode = function (code) {
  let received = this.api.response.statusCode
  let err = `${this.api.response.request.prefix} The response httpCode is invalid, received ${received} should be ${code}`
  assert.strictEqual(this.api.response.statusCode, code, err)
}

Then.httpTiming = function (timeMs) {
  let received = Math.round(this.api.response.timing)
  let err = `${this.api.response.request.prefix} The response time is invalid, received ${received} should be lower than ${timeMs}`
  assert.ok(received < timeMs, err)
}


/*
 * =========================================
 * Response API Headers Functions
 * =========================================
 */


Then.headerValueExist = function (property) {
  let err = `${this.api.response.request.prefix} The response header should contain the ${property} property`
  assert.notStrictEqual(this.api.response.findInHeader(property), undefined, err)
}

Then.headerValueNotExist = function (property) {
  let err = `${this.api.response.request.prefix} The response header should not contain the ${property} property`
  assert.strictEqual(this.api.response.findInHeader(property), undefined, err)
}

Then.headerValueEqual = function (header, value) {
  let received =  this.api.response.findInHeader(header)
  let err = `${this.api.response.request.prefix} The response header is invalid, the ${header} property should be ${value} but received ${received}`
  assert.strictEqual(received, value, err)
}

Then.headers = function (table) {
  table.raw().forEach(args => Then.headerValueEqual.apply(this, args))
}

/*
 * =========================================
 * Response API Body Functions
 * =========================================
 */

Then.shouldBeEmptyArrayResponse = function () {
  assert.strictEqual(this.api.response.body.length, 0)
}

Then.shouldBeEmptyResponse = function () {
  assert.strictEqual(this.api.response.body, undefined)
}

Then.shouldBeString = function (property, value) {
  value = this.data.get(value)
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

/*
 * =========================================
 * Response API DataSet Functions
 * =========================================
 */

Then.addHeaderPropertyToDataset = function(bodyProperty, propertyName) {
  let val = this.api.response.findInHeader(bodyProperty)
  this.data.set(propertyName, val)
}

Then.addBodyPropertyToDataset = function(bodyProperty, propertyName) {
  let val = this.api.response.findInBody(bodyProperty)
  this.data.set(propertyName, val)
}

module.exports = Then

