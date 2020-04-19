const given = require('./functions')


module.exports = [
  /**
   *  Format:
   *  ['Step definition', function handler, 'description','Tags']
   *
   *  Example:
   *  ['I do {int} + {int}', add, 'Calculate an addition', 'add, calculator, additional']
   *
   */
  ['I have the api gateway', given.gateway, 'Create a new api request targeting the default api gateway', 'api'],

  // Path + method
  ['I have the path {string}', given.path, 'add the path of the request (ex: /quotes)', 'request, path, api'],
  ['I have the method {string}', given.method, 'add the method to the request (ex: POST)', 'request, method, api'],
  ['I send a {string} request to {string}', given.methodPath, 'add the method and the path of the request', 'request, method, path, api'],

  // Headers
  ['the header contains {string} as {data}', given.header, 'add a placeholded value to request headers  (ex "apikey" -> {{ apikey }})', 'request, headers'],
  ['the header contains {string} as {string}', given.header, 'add a string value to request headers (ex "x-correlation-id" -> "xxxx-xxxxx-1111-2222")', 'request, headers'],
  ['I add the headers:', given.headers, 'Adding multiple headers to the request (table format)', 'request, headers, table'],

  // Query parameters
  ['the query parameter contains {string} as {data}', given.queryString, 'add a placeholded value to request query parameter (ex "gender" : {{ gender }} for "gender=1")', 'request, query string, qs'],
  ['the query parameter contains {string} as {string}', given.queryString, 'add a string value to request query parameter  (ex "gender" : "MALE" for "gender=MALE")', 'request, query string, qs'],
  ['the query parameter contains {string} as {int}', given.queryString, 'add a string value to request query parameter (ex "gender" : "1" for "gender=1")', 'request, query string, qs'],
  ['I add the query string parameters:', given.qs, 'Adding multiple query parameters to the request (table format)', 'request, query string, qs, table'],


  // Request Body json
  ['the payload contains {string} as {data}', given.payload, 'add a property with placeholded value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.id" -> {{quoteId}})', 'request, body, restqdata'],
  ['the payload contains {string} as {string}', given.payload, 'add a property with string value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.id" -> "ASD12355")', 'request, body, dot'],
  ['the payload contains {string} as {int}', given.payload, 'add a property with int value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> 200)', 'request, body, dot'],
  ['the payload contains {string} as {float}', given.payload, 'add a property with float value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> 200)', 'request, body, dot'],
  ['the payload contains {string} as null', given.payloadNull, 'add a property with null value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> null)', 'request, body, null'],
  ['the payload contains {string} as true', given.payloadTrue, 'active" -> true', 'request, body, boolean'],
  ['the payload contains {string} as false', given.payloadFalse, 'active" -> false', 'request, body, boolean'],
  ['the payload contains {string} as empty array', given.payloadEmptyArray, 'add property with empty array to the request body', 'request, body, array'],
  ['I add the request body:', given.payloads, 'Adding multiple query parameters to the request (table format)', 'request, body, dot, table'],
]

