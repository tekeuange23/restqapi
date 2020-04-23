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
  let received = this.api.response.body.length
  let err = `${this.api.response.request.prefix} The response body should return an empty array, but received an array with ${received} items`
  assert.strictEqual(received, 0, err)
}

Then.shouldBeEmptyResponse = function () {
  let err = `${this.api.response.request.prefix} The response body should be empty`
  assert.strictEqual(this.api.response.body, undefined, err)
}


Then.shouldBeNumber = function (property, value) {
  let received = this.api.response.findInBody(property)
  value = this.data.get(value)
  let err = `${this.api.response.request.prefix} The response body property ${property} should be ${value} but received ${received}`
  assert.strictEqual(received, Number(value), err)
}

Then.shouldBeTrue = function (property) {
  let received = this.api.response.findInBody(property)
  let err = `${this.api.response.request.prefix} The response body property ${property} should be true but received ${received}`
  assert.strictEqual(received, true, err)
}

Then.shouldBeFalse = function (property) {
  let received = this.api.response.findInBody(property)
  let err = `${this.api.response.request.prefix} The response body property ${property} should be false but received ${received}`
  assert.strictEqual(received, false, err)
}

Then.shouldBeNull = function (property) {
  let received = this.api.response.findInBody(property)
  let err = `${this.api.response.request.prefix} The response body property ${property} should be null but received ${received}`
  assert.strictEqual(received, null, err)
}

Then.shouldBeString = function (property, value) {
  value = this.data.get(value)
  switch(value) {
    case 'true':
      Then.shouldBeTrue(property)
      break
    case 'false':
      Then.shouldBeFalse(property)
      break
    case 'null':
      Then.shouldBeNull(property)
      break
    default:
      let received = this.api.response.findInBody(property)
      let err = `${this.api.response.request.prefix} The response body property ${property} should be ${value} but received ${received}`
      assert.strictEqual(received, value, err)
  }
}

Then.shouldBeEmpty = function (property) {
  let received = this.api.response.findInBody(property)
  let err = `${this.api.response.request.prefix} The response body property ${property} should be empty but received ${received}`
  assert.strictEqual(received, '', err)
}

Then.shouldNotBeNull = function (property) {
  let received = this.api.response.findInBody(property)
  let err = `${this.api.response.request.prefix} The response body property ${property} should not be null but received null`
  assert.notStrictEqual(received, null, err)
}

Then.shouldBeArraySize = function (value) {
  let received = this.api.response.body.length
  let err = `${this.api.response.request.prefix} The response body property should contain an array of ${value} items but received an array of ${received} items`
  assert.strictEqual(received, value, err)
}

Then.shouldMatch = function (property, value) {
  let received = String(this.api.response.findInBody(property))
  let err = `${this.api.response.request.prefix} The response body property ${property} should match the regexp ${value} but received : ${received}`
  let regex = new RegExp(value)
  assert.ok(regex.test(received), err)
}


Then.shouldBeNow = function (property) {
  let received = this.api.response.findInBody(property)
  let diff = Date.now() - new Date(received).getTime()
  let err = `${this.api.response.request.prefix} The response body property ${property} should be close to now, but received : ${received}`
  assert.ok(diff < 60000, err)
}

/*
 * =========================================
 * Response API DataSet Functions
 * =========================================
 */

Then.addHeaderPropertyToDataset = function(headerProperty, dataKey) {
  let val = this.api.response.findInHeader(headerProperty)
  this.data.set(dataKey, val)
}

Then.addBodyPropertyToDataset = function(bodyProperty, propertyName) {
  let val = this.api.response.findInBody(bodyProperty)
  this.data.set(propertyName, val)
}

module.exports = Then
