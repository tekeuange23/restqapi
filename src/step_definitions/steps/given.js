const { given } = require('../functions')

module.exports = [
  ['A dataset:', given.dataset, 'Defined a dataset as a table to add to the book per environment (SIT, SANDBOX, PROD)'],
  ['I have the api gateway', given.gateway, 'Create a new api request targeting the default api gateway'],
  ['I send a {string} request to {string}', given.methodPath, 'add the method and the path of the request'],
  ['I add the headers:', given.headers, 'Adding multiple headers to the request (table format)'],
  ['I add the query string parameters:', given.qs, 'Adding multiple query parameters to the request (table format)'],
  ['I add the request body:', given.jsonBody, 'Adding multiple query parameters to the request (table format)'],

  ['I need the scopes {string}', given.scopes, 'Define which scopes are required'],
  ['I have an access token', given.accessToken, 'Add bearer token to the request the access token'],
  ['I have an expired access token', given.expiredAccessToken, 'Add bearer token to the request header with expired token'],
  ['I have an invalid access token', given.invalidAccessToken, 'Add bearer token to the request header with invalid signature'],
  ['I have the method {string}', given.method, 'add the method to the request (ex: POST)'],
  ['the header contains {string} as {string}', given.header, 'add a string value to request headers (ex "x-correlation-id" -> "xxxx-xxxxx-1111-2222")'],
  ['the header contains {string} as {int}', given.header, 'add a int value to request headers  (ex "x-service" -> 200)'],
  ['I have the path {string}', given.path, 'add the path of the request (ex: /quotes)'],
  ['the query parameter contains {string} as {string}', given.queryString, 'add a string value to request query parameter  (ex "gender" : "MALE" for "gender=MALE")'],
  ['the query parameter contains {string} as {int}', given.queryString, 'add a string value to request query parameter (ex "gender" : "1" for "gender=1")'],
  ['the query parameter contains {string} as {int}', given.queryString, 'add a string value to request query parameter (ex "gender" : "1" for "gender=1")'],
  ['the payload contains {string} as {string}', given.payload, 'add a property with string value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.id" -> "ASD12355")'],
  ['the payload contains {string} as {int}', given.payload, 'add a property with int value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> 200)'],
  ['the payload contains {string} as {float}', given.payload, 'add a property with float value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> 200)'],
  ['the payload contains {string} as null', given.payloadNull, 'add a property with null value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> null)'],
  ['the payload contains {string} as true', given.payloadTrue, 'active" -> true'],
  ['the payload contains {string} as false', given.payloadFalse, 'active" -> false'],
  ['the payload contains {string} from notebook as {string}', given.payloadFromNotebook, 'get value from notebook'],
  ['the payload contains {string} from notebook as int {string}', given.payloadFromNotebookInt, 'get value from notebook and convert to Int'],
  ['the payload contains {string} from notebook as float {string}', given.payloadFromNotebookFloat, 'get value from notebook and convert to Float'],
  ['the payload contains {string} as empty array', given.payloadEmptyArray, 'add property with empty array to the request body']

]
