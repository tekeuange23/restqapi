# RestqAPI

> An Awesome Cucumber library providing ready to use steps to test REST APIs

## What is RestqAPI ?

RestQapi is a part of the [RestQA](https://restqa.io) ecosystem.
In order to test RESTful API through automation, RestQapi is proving an awesome bootstrap for you to kick in within a few minute.
Based on [cucumber-js](https://github.com/cucumber/cucumber-js), the library expand the number of defined step on one of your current automation project based on cucumber-js.

## Requirements

* Node.js >= 12
* Cucumber >= 6.0.5

## Installation

Using npm:

```
npm install @restqa/restqapi cucumber
```

Using yarn:

```
yarn add @restqa/restqapi cucumber
```

Then you will need to create or update your `world.js` file:

```js
//support/world.js

const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')

const RestQapi = require('./restqapi')

const options = {
  name: 'local',
  url: 'http://example.com',
}

const rQapi = new RestQapi(config)

rQapi.setParameterType(defineParameterType)
rQapi.setSteps({ Given, When, Then })
rQapi.setHooks({ Before, BeforeAll, After, AfterAll })

setWorldConstructor(rQapi.getWorld())
```

#### Run your Spec

```
./node_modules/.bin/cucumber-js
```

### Configuration

In order to run the test you will need to pass an option object to the RestQapi instance

```
const config = {
  name: 'local',
  url: 'http://host.docker.internal:8080',
  data: {
    channel: 'google-sheet',
    config: {
      id: process.env.GOOGLE_SHEET_ID,
      apikey: process.env.GOOGLE_SHEET_APIKEY
    },
    startSymbol: '{[',
    endSymbol: ']}'
  },
  secrets: {
    'api-key': 'xxx-yyy-zzz'
  },
}

```

-------------------------------

### `Options`

key | option type / notes | required | example
----|---------------------| -------- | -------
`name` | string | false | `uat`
`url` | string | true | `https://api.uat.example.com`
`data.channel` | string <br /> google-sheet / csv / confluence (more info on the [restqdata library](https://github.com/restqa/restqdata)) | false | `csv`
`data.config` | object <br/> The config will depend on the given channel check the [available options](https://github.com/restqa/restqdata#options) | true (if channel is defined) | `{ folder: 'data'}`
`data.startSymbol` | string | false <br /> (default: `{{`) | `{[`
`data.endSymbol` | string | false <br /> (default: `}}`) |  `{{`
`secrets` | Object <br /> List of secret variable you will want to access within our scenario (ex: apikey, token, etc...) | false |  `{ apikey : 'xxx-yyy-zzz'}`

#### Working with external datasets

In order to decouple your datasets from your scenarios, RestQapi is leveraging the [RestQdata library](https://github.com/restqapi/restqdata).
RestQdata is allowing you to connect RestQapi with an external data source such as :

* Confluence (Your confluence instance should be accessible from restqa run environment)
* Google sheets
* Csv (file need to be hosted next to your `.feature` file

Feel free to look at the restqdata options : https://github.com/restqa/restqdata

Then once your dataset is connected you will need to start using them in your test scenario.

Example:

The sheet's name is *users* and contains the following information

|   | firstname | lastname | gender |
| --| --------- | -------- | ------ |
| 1 | John      | Doe      | Male   |
| 2 | Alex      | kid      | Male   |
| 3 | Lois      | Lane     | Female |

Then to use the **Lois Lane** information into the scenario you will just need have the following steps

```
Given the query parameter contains "firstname" as {{ users.3.firstname }}
Given the query parameter contains "lastname" as {{ users.3.lastname }}
Given the query parameter contains "gender" as {{ users.3.gender }}
```

As you can see we used `{{ users:3:firtsname }}` to identify the word **Lois**.
The concept is simple, to identify a specific information use the patter `{{resource.row.colum}}`

More specifically:

* *Resource* is the name of your sheet
* *row* is the number of the row
* *column* is the column name



#### Working with secrets

Secret are private data that might be required by your api to response properly.
In order to have your secret extracted from you scenario you can add them in the options
Then you can use it exactly like any other dataset:

```
// world.js

const options = {
  name: 'local',
  url: 'http://host.docker.internal:8080',
  secrets: {
    'api-key': 'xxx-yyy-zzz'
  }
}
```

Then inside your scenario : 

```
Given the header contains "x-api-key" as {{ api-key }}
```


## Example

This repository comes with few examples, in order to run them, invoke the following script:

```
npm run start:example
```

## License

[Apache 2.0 License](./LICENSE)
