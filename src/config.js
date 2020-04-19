module.exports = {
  name: 'local',
  url: 'http://host.docker.internal:8080',
  secrets: {
    'api-key': 'xxx-yyy-zzz'
  },
  data: {
    channel: 'google-sheet',
    config: {
      id: process.env.GOOGLE_SHEET_ID,
      apikey: process.env.GOOGLE_SHEET_APIKEY,
    },
    startSymbol: '{[',
    endSymbol: ']}'
  }
}
