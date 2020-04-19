const When = {}

When.callApi = async function () {
  const result = await this.api.run()
  return result
}

module.exports = When

