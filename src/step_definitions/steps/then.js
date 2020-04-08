const { then } = require('../functions')

module.exports = [
  ['I should receive a response with the status {int}', then.httpCode, 'Check the response http code'],
  ['the response headers should contains:', then.headers, ''],
  ['the response time is under {int} ms', then.httpTiming, 'Check the response latency'],
  ['{string} should be on the response header', then.headerValueIsExist, 'Check if a property is in the response header'],
  ['{string} should not be on the response header', then.headerValueIsNotExist, 'Check if a property is in the response header'],
  ['the response should be empty array', then.shouldBeEmptyArrayResponse, 'Check a value in the body response that it is empty array'],
  ['the response should be empty', then.shouldBeEmptyResponse, 'Check a value in the body response that it is empty array'],
  ['the response body at {string} should equal {restqdata}', then.shouldBeString, 'Check a value in the body response as a string (dot-object pattern)'],
  ['the response body at {string} should equal {string}', then.shouldBeString, 'Check a value in the body response as a string (dot-object pattern)'],
  ['the response body at {string} should equal {int}', then.shouldBeNumber, 'Check a value in the body response as a int (dot-object pattern)'],
  ['the response body at {string} should equal {float}', then.shouldBeNumber, 'Check a value in the body response as a float (dot-object pattern)'],
  ['the response body at {string} should equal true', then.shouldBeTrue, 'Check if a value is true in the body response (dot-object pattern)'],
  ['the response body at {string} should equal false', then.shouldBeFalse, 'Check if a value is false in the body response (dot-object pattern)'],
  ['the response body at {string} should equal null', then.shouldBeNull, 'Check if a value is null in the body response (dot-object pattern)'],
  ['the response body at {string} should equal empty', then.shouldBeEmpty, 'Check if a value is empty in the body response (dot-object pattern)'],
  ['the response body at {string} should equal close to now', then.shouldBeNow, 'Check if a date is close to now (ex: to check if a createdAt date is valid)'],
  ['the response body at {string} should not be null', then.shouldNotBeNull, 'Check if a value is not null in the body response (dot-object pattern)'],
  ['the response body at {string} should match {string}', then.shouldMatch, 'Check if a value match a specific regex'],
  ['the response list should contain {int} item', then.shouldBeArraySize, 'Check if the response list is of a certain size'],
  ['the header {string} should be {string}', then.headerValueShouldBeString, 'Check if a property in the response header has the exact string value'],
  ['clean', () => {}, 'Cleaning the api buffer ??']
]
