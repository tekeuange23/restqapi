const dot = require('dot-object')
const Given = {}

Given.dataset = function (table) {
  let data = table
    .hashes()
    .find(row => row.Env.toLowerCase() === this.CONFIG.env.toLowerCase())
  this.apis.notebook.addSet(data)
}

Given.gateway = function () {
  this.api = this.apis.create()
}

Given.methodPath = function (method, path) {
  Given.method.call(this, method)
  Given.path.call(this, path)
}

Given.headers = function(table) {
  table.raw().forEach(args => Given.header.apply(this, args))
}

Given.qs = function(table) {
  table.raw().forEach(args => Given.queryString.apply(this, args))
}

Given.jsonBody = function(table) {
  table.raw().forEach(args => Given.payload.apply(this, args))
}

Given.scopes = function (scopes) {
  scopes = scopes.split(' ').map( _ => _.trim())
  this.api.iam.scopes = scopes
}


Given.method = function (method) {
  this.api.request.setMethod(method.toLowerCase())
}

Given.header = function (property, value) {
  value = this.apis.notebook.get(value)
  this.api.request.setHeader(property, value)
}

Given.queryString = function (property, value) {
  value = this.apis.notebook.get(value)
  this.api.request.setQueryString(property, value)
}

Given.path = function (path) {
  path = this.apis.notebook.get(path)
  this.api.request.setPath(encodeURI(path))
}

Given.accessToken = async  function () {
  let token = await this.api.iam.getAccessToken()
  this.api.request.setBearer(token)
}

Given.expiredAccessToken = async function () {
  this.api.request.setBearer(this.CONFIG.iam.expiredToken)
}

Given.invalidAccessToken = function () {
  this.api.request.setBearer('invalid-access-token')
}

Given.payload = function (property, value) {
  this.api.request.addPayload(property, value)
}

Given.payloadFromNotebook = function (property, value) {
  value = this.apis.notebook.get(value)
  this.api.request.addPayload(property, value)
}

Given.payloadFromNotebookInt = function (property, value) {
  value = this.apis.notebook.get(value)
  value = parseInt(value)
  this.api.request.addPayload(property, value)
}

Given.payloadFromNotebookFloat = function (property, value) {
  value = this.apis.notebook.get(value)
  value = parseFloat(value)
  this.api.request.addPayload(property, value)
}

Given.payloadNull = function (property) {
  this.api.request.addPayload(property, null)
}

Given.payloadTrue = function (property) {
  this.api.request.addPayload(property, true)
}

Given.payloadFalse = function (property) {
  this.api.request.addPayload(property, false)
}

Given.payloadEmptyArray = function (property) {
  this.api.request.addPayload(property, [])
}

module.exports = Given
