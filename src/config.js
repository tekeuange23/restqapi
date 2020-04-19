let GOOGLE_SHEET_ID = '13RqudwkMjp9ilOVM9L26r63FKN6-OlIveGc95q3YLsM'
let GOOGLE_SHEET_APIKEY = 'AIzaSyAlhYZlVSUimjtT1EluwLv5bXWEvobMvbU'

module.exports = {
  name: 'local',
  url: 'http://host.docker.internal:8080',
  secrets: {
    'api-key': 'xxx-yyy-zzz'
  },
  data: {
    channel: 'google-sheet',
    config: {
      id: GOOGLE_SHEET_ID,
      apikey: GOOGLE_SHEET_APIKEY,
    },
    startSymbol: '{[',
    endSymbol: ']}'
  }
}
