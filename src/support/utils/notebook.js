function Notebook() {
  let _data = {}
  return {
    addSet: function(data) {
      _data = data
    },
    get: function(value) {
      var parameterList = value.match(/\{(.*?)\}/g)
      if (parameterList) {
        for (var i = 0; i < parameterList.length; i++) {
          var param = parameterList[i].match(/\{(.*)\}/)
          if (param) {
            value = value.replace(param[0], _data[param[1]])
          }
        }
      }
      return value
    }
  }
}

module.exports = Notebook

