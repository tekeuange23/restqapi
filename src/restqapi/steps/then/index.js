const then = require('./functions')

module.exports = [
  /**
   *  Format:
   *  ['Step definition', function handler, 'description','Tags']
   *
   *  Example:
   *  ['I do {int} + {int}', add, 'Calculate an addition', 'add, calculator, additional']
   *
   */

  // default response info
  ['I should receive a response with the status {int}', then.httpCode, 'Check the response http code', 'api, response, status, httpcode'],
  ['the response time is under {int} ms', then.httpTiming, 'Check the response latency', 'api, response, time, timing, latency'],

  // Response Headers
  ['the response headers should contains:', then.headers, 'Check multiple response headers (table format)', 'api, response, table, headers, header'],
  ['{string} should be on the response header', then.headerValueExist, 'Check if a property is in the response header', 'api, response, table, headers, header'],
  ['{string} should not be on the response header', then.headerValueNotExist, 'Check if a property is in the response header', 'api, response, table, headers, header'],
  ['the header {string} should be {string}', then.headerValueEqual, 'Check if a property in the response header has the exact string value', 'api, response, table, headers, header'],

  // Response body
  ['the response should be empty array', then.shouldBeEmptyArrayResponse, 'Check a value in the body response that it is empty array', 'api, response, body, array'],
  ['the response should be empty', then.shouldBeEmptyResponse, 'Check if the response body is empty', 'api, response, body'],
  ['the response body at {string} should equal {data}', then.shouldBeString, 'Check a value in the body response as a string (dot-object pattern)', 'api, response, body, jsonpath, dot-object, data'],
  ['the response body at {string} should equal {string}', then.shouldBeString, 'Check a value in the body response as a string (dot-object pattern)', 'api, response, body, jsonpath, dot-object, string'],
  ['the response body at {string} should equal {int}', then.shouldBeNumber, 'Check a value in the body response as a int (dot-object pattern)', 'api, response, body, jsonpath, dot-object, number'],
  ['the response body at {string} should equal true', then.shouldBeTrue, 'Check if a value is true in the body response (dot-object pattern)', 'api, response, body, jsonpath, dot-object, true'],
  ['the response body at {string} should equal false', then.shouldBeFalse, 'Check if a value is false in the body response (dot-object pattern)', 'api, response, body, jsonpath, dot-object, false'],
  ['the response body at {string} should equal null', then.shouldBeNull, 'Check if a value is null in the body response (dot-object pattern)', 'api, response, body, jsonpath, dot-object, null'],
  ['the response body at {string} should equal empty', then.shouldBeEmpty, 'Check if a value is empty in the body response (dot-object pattern)', 'api, response, body, jsonpath, dot-object, empty'],
  ['the response body at {string} should equal close to now', then.shouldBeNow, 'Check if a date is close to now (ex: to check if a createdAt date is valid)', 'api, response, body, jsonpath, dot-object, now'],
  ['the response body at {string} should not be null', then.shouldNotBeNull, 'Check if a value is not null in the body response (dot-object pattern)', 'api, response, body, jsonpath, dot-object, null'],
  ['the response body at {string} should match {string}', then.shouldMatch, 'Check if a value match a specific regex', 'api, response, body, jsonpath, dot-object, regexp, regex'],
  ['the response list should contain {int} item', then.shouldBeArraySize, 'Check if the response list is of a certain size', 'api, response, body, jsonpath, dot-object, array'],

  // Response Dataset
  ['add the value {string} from the response body to the dataset as {string}', then.addBodyPropertyToDataset, 'Take on of the value from the response body and add it to the dataset', 'api, response, body, jsonpath, dot-object, dataset'],
  ['add the value {string} from the response header to the dataset as {string}', then.addHeaderPropertyToDataset, 'Take on of the value from the response header and add it to the dataset', 'api, response, header, jsonpath, dot-object, dataset']
]
