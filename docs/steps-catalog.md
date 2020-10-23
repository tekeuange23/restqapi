## Modules

<dl>
<dt><a href="#module_Given">Given</a></dt>
<dd><p>All the steps related to the API Request</p>
</dd>
<dt><a href="#module_When">When</a></dt>
<dd><p>All the steps related to the Api call</p>
</dd>
<dt><a href="#module_Then">Then</a></dt>
<dd><p>All the steps related to the API response</p>
</dd>
</dl>

<a name="module_Given"></a>
All the steps related to the API Request


* [Given](#module_Given)
    * [~gateway()](#module_Given..gateway)
    * [~gateway()](#module_Given..gateway)
    * [~path()](#module_Given..path)
    * [~method()](#module_Given..method)
    * [~methodPath()](#module_Given..methodPath)
    * [~header()](#module_Given..header)
    * [~headers()](#module_Given..headers)
    * [~queryString()](#module_Given..queryString)
    * [~queriesString()](#module_Given..queriesString)
    * [~JsonPayload()](#module_Given..JsonPayload)
    * [~JsonPayloadNull()](#module_Given..JsonPayloadNull)
    * [~JsonPayloadTrue()](#module_Given..JsonPayloadTrue)
    * [~JsonPayloadFalse()](#module_Given..JsonPayloadFalse)
    * [~JsonPayloadEmptyArray()](#module_Given..JsonPayloadEmptyArray)
    * [~JsonPayloadTable()](#module_Given..JsonPayloadTable)

<a name="module_Given..gateway"></a>
### Given I have the api gateway
Define the api gateway host (take a look at the config file).

**Example**  
```js
Given I have the api gateway
```
<a name="module_Given..gateway"></a>
### Given I have the api gateway hosted on {string}
Define the api gateway hosted on the given on the specific api gateway

**Example** *(If you want to use a specific host you can use)*  
```js
Given I have the api gateway hosted on "https://api.example.com"
```
<a name="module_Given..path"></a>
### Given I have the path {string}
Define the request path
placeholder can be used within the path for dynamic call (ex: /users/{{userid}})

**Example**  
```js
Given I have the path "/users/1"
Given I have the path "/users/1/addresses"
Given I have the path "/users/{{ userId }}/addresses"
```
<a name="module_Given..method"></a>
### Given I have the method {string}
Define the request method (default GET)
Available : GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD

**Example**  
```js
Given I have the method "PATCH"
```
<a name="module_Given..methodPath"></a>
### Given I send a {string} request to {string}
Construct a request to a resource using an HTTP method

**Example**  
```js
Given I send a "GET" request to "/customers"
Given I send a "POST" request to "/customers"
Given I send a "PUT" request to "/customers/1234"
Given I send a "DELETE" request to "/customers/1234"
```
<a name="module_Given..header"></a>
### Given the header contains {string} as {string}
Set one request header

**Example**  
```js
Given the header contains "Content-Type" as "application/json"
Given the header contains "Accept-language" as "en"
Given the header contains "user-agent" as "curl"
```
**Example** *(Placeholder from datasets)*  
```js
Given the header contains "Accept-language" as {{ language }}
Given the header contains "user-agent" as {{ currentUserAgent }}
```
<a name="module_Given..headers"></a>
### Given I add the headers:
Set one or more request headers in a single step.

**Example**  
```js
Given I add the headers:
  | Content-Type     | application/json |
  | Accept-Language  | en               |
```
**Example** *(Placeholder from datasets)*  
```js
Given I add the headers:
  | Content-Type     | {{contentType}} |
  | Accept-Language  | {{ language }}  |
```
<a name="module_Given..queryString"></a>
### Given the query parameter contains {string} as {string}
Set one or more request query parameters (example: /pets?price=10&name=john)

**Example** *(string)*  
```js
Given the query parameter contains "sort" as "price"
Given the query parameter contains "name" as "john"
```
**Example** *(number)*  
```js
Given the query parameter contains "limit" as 10
Given the query parameter contains "offset" as 30
```
**Example** *(Placeholder from datasets)*  
```js
Given the query parameter contains "sort" as {{ price }}
Given the query parameter contains "name" as {{ name }}
```
<a name="module_Given..queriesString"></a>
### Given I add the query string parameters:
Set one or more request query parameter in a single step.

**Example**  
```js
Given I add the query string parameters:
  | sort     | price |
  | name     | john  |
```
**Example** *(Placeholder from datasets)*  
```js
Given I add the query string parameters:
  | sort     | {{ sort }} |
  | name     | {{ name }}  |
```
<a name="module_Given..JsonPayload"></a>
### Given the payload contains {string} as {string | int | float | placeholder | data}
Set one or more request json body (support dot-object or jsonpath property)

**Example** *(string)*  
```js
Given the payload contains "firstname" as "john"
Given the payload contains "lastname" as "doe"
Given the payload contains "people.lastname" as "doe"
```
**Example** *(int)*  
```js
Given the paylaod contains "limit" as 10
Given the paylaod contains "offset" as 30
Given the paylaod contains "page.offset" as 30
```
**Example** *(float)*  
```js
Given the paylaod contains "size" as 1.1
Given the paylaod contains "weight" as 1.0
Given the paylaod contains "body.weight" as 1.0
```
**Example** *(Placeholder form from datasets)*  
```js
Given the paylaod contains "sort" as {{ price }}
Given the paylaod contains "name" as {{ name }}
Given the paylaod contains "list.name" as {{ name }}
```
<a name="module_Given..JsonPayloadNull"></a>
### Given the payload contains {string} as null
Set a value as null in the json request body (support dot-object or jsonpath property)

**Example**  
```js
Given the payload contains "firstname" as null
Given the payload contains "user.firstname" as null
```
<a name="module_Given..JsonPayloadTrue"></a>
### Given the payload contains {string} as true
Set a value as true in the json request body (support dot-object or jsonpath property)

**Example**  
```js
Given the payload contains "active" as true
Given the payload contains "user.active" as true
```
<a name="module_Given..JsonPayloadFalse"></a>
### Given the payload contains {string} as false
Set a value as false in the json request body (support dot-object or jsonpath property)

**Example**  
```js
Given the payload contains "active" as false
Given the payload contains "user.active" as false
```
<a name="module_Given..JsonPayloadEmptyArray"></a>
### Given the payload contains {string} as empty array
Set a value as empty array in the json request body (support dot-object or jsonpath property)

**Example**  
```js
Given the payload contains "list" as empty array
Given the payload contains "user.list" as empty array
```
<a name="module_Given..JsonPayloadTable"></a>
### Given I add the request body:
Set one or more request body information in a single step.

**Example**  
```js
Given I add the request body:
  | firstname | john |
  | lastname  | doe  |
```
**Example** *(Placeholder from datasets)*  
```js
Given I add the request body:
  | firstname    | {{ firstName }} |
  | lastname     | {{ lastName }}  |
```
<a name="module_When"></a>
All the steps related to the Api call

<a name="module_When..callApi"></a>
### When I run the API
Trigger the api call

**Example**  
```js
When I run the API
```
<a name="module_Then"></a>
All the steps related to the API response


* [Then](#module_Then)
    * [~httpCode()](#module_Then..httpCode)
    * [~httpLatency()](#module_Then..httpLatency)
    * [~header()](#module_Then..header)
    * [~headers()](#module_Then..headers)
    * [~headersContains()](#module_Then..headersContains)
    * [~headersNotContains()](#module_Then..headersNotContains)
    * [~emptyArray()](#module_Then..emptyArray)
    * [~notEmptyArray()](#module_Then..notEmptyArray)
    * [~emptyResponse()](#module_Then..emptyResponse)
    * [~bodyPropertyEqual()](#module_Then..bodyPropertyEqual)
    * [~bodyPropertyEqualTrue()](#module_Then..bodyPropertyEqualTrue)
    * [~bodyPropertyEqualFalse()](#module_Then..bodyPropertyEqualFalse)
    * [~bodyPropertyEqualNull()](#module_Then..bodyPropertyEqualNull)
    * [~bodyPropertyEqualEmpty()](#module_Then..bodyPropertyEqualEmpty)
    * [~bodyPropertyIsArray()](#module_Then..bodyPropertyIsArray)
    * [~bodyPropertyIsArrayOfLenght()](#module_Then..bodyPropertyIsArrayOfLenght)
    * [~bodyPropertyIsATimeCloseToNow()](#module_Then..bodyPropertyIsATimeCloseToNow)
    * [~bodyPropertyIsNotNull()](#module_Then..bodyPropertyIsNotNull)
    * [~bodyPropertyShouldMatchRegexp()](#module_Then..bodyPropertyShouldMatchRegexp)
    * [~bodyListContainNumberOfItem()](#module_Then..bodyListContainNumberOfItem)
    * [~saveHeaderPropertyIntoTheDataset()](#module_Then..saveHeaderPropertyIntoTheDataset)
    * [~saveBodyPropertyIntoTheDataset()](#module_Then..saveBodyPropertyIntoTheDataset)
    * [~printRequest()](#module_Then..printRequest)
    * [~printResponse()](#module_Then..printResponse)
    * [~printValue()](#module_Then..printValue)

<a name="module_Then..httpCode"></a>
### Then I should receive a response with the status {int}
Ensure the response was received with a given status.

**Example**  
```js
Then I should receive a response with the status 200
Then I should receive a response with the status 404
```
<a name="module_Then..httpLatency"></a>
### Then the response time is under {int} ms
Ensure the response time is lower than the given time (in microseconds)

**Example**  
```js
Then the response time is under 100ms
```
<a name="module_Then..header"></a>
### Then the header {string} should be {string}
Ensure a response header equals the expect value

**Example**  
```js
Then the header "Content-Type" should be "application/json"
```
<a name="module_Then..headers"></a>
### Then the response header should contains:
Ensure a response header equals the list of values

**Example**  
```js
Then the response headers should contains:
  | Content-Type   | application/json |
  | Content-Length | 1458             |
```
**Example** *(Using placeholders)*  
```js
Then the response headers should contains:
  | Content-Type   | {{ contentType}} |
  | Content-Length | 1458             |
```
<a name="module_Then..headersContains"></a>
### Then {string} should be on the response header
Ensure a response header contains one specific property

**Example**  
```js
Then "Content-Length" should be on the response header
Then "X-response-time" should be on the response header
```
<a name="module_Then..headersNotContains"></a>
### Then {string} should not be on the response header
Ensure a response header doesn't contain one specific property

**Example**  
```js
Then "X-response-time" should not be on the response header
Then "poweered-by" should be not on the response header
```
<a name="module_Then..emptyArray"></a>
### Then the response should be empty array
Ensure a response body contains an empty array

**Example**  
```js
Then the response should be empty array
```
<a name="module_Then..notEmptyArray"></a>
### Then the response should not be empty array
Ensure a response body doesn't contain an empty array

**Example**  
```js
Then the response should not be empty array
```
<a name="module_Then..emptyResponse"></a>
### Then the response should be empty
Ensure a response body is empty

**Example**  
```js
Then the response should be empty
```
<a name="module_Then..bodyPropertyEqual"></a>
### Then the response body at {string} should equal {string | int | data }
Ensure a JSON response body equals a given value at the JSON path. Equality is determined

**Example** *(Using dot object)*  
```js
Then the response body at "id" should equal 10
Then the response body at "user.firstname" should equal "john"
Then the response body at "user.lastname" should equal {{ lastname }}
```
**Example** *(Using json path)*  
```js
Then the response body at "$.id" should equal 10
Then the response body at "$.user.firstname" should equal "john"
Then the response body at "$.user.lastname" should equal {{ lastname }}
```
<a name="module_Then..bodyPropertyEqualTrue"></a>
### Then the response body at {string} should equal true
Ensure a JSON response body equals a given boolean value as true

**Example** *(Using dot object)*  
```js
Then the response body at "active" should equal true
```
**Example** *(Using json path)*  
```js
Then the response body at "$.active" should equal true
```
<a name="module_Then..bodyPropertyEqualFalse"></a>
### Then the response body at {string} should equal false
Ensure a JSON response body equals a given boolean value as false

**Example** *(Using dot object)*  
```js
Then the response body at "active" should equal false
```
**Example** *(Using json path)*  
```js
Then the response body at "$.active" should equal false
```
<a name="module_Then..bodyPropertyEqualNull"></a>
### Then the response body at {string} should equal null
Ensure a JSON response body equals a given null value

**Example** *(Using dot object)*  
```js
Then the response body at "active" should equal null
```
**Example** *(Using json path)*  
```js
Then the response body at "$.active" should equal null
```
<a name="module_Then..bodyPropertyEqualEmpty"></a>
### Then the response body at {string} should equal empty
Ensure a JSON response body equals an empty string

**Example** *(Using dot object)*  
```js
Then the response body at "active" should equal empty
```
**Example** *(Using json path)*  
```js
Then the response body at "$.active" should equal empty
```
<a name="module_Then..bodyPropertyIsArray"></a>
### Then the response body at {string} should be an array
Ensure a JSON response body equals an array type

**Example** *(Using dot object)*  
```js
Then the response body at "user.list" should be an array
```
**Example** *(Using json path)*  
```js
Then the response body at "$.user.list" should be an array
```
<a name="module_Then..bodyPropertyIsArrayOfLenght"></a>
### Then the response body at {string} should be an array of {int} item(s)
Ensure a JSON response body equals an array containing a given items

**Example** *(Using dot object)*  
```js
Then the response body at "user.list" should be an array of 10 item(s)
```
**Example** *(Using json path)*  
```js
Then the response body at "$.user.list" should be an array of 10 item(s)
```
<a name="module_Then..bodyPropertyIsATimeCloseToNow"></a>
### Then the response body at {string} should be close to now
Ensure a JSON response body has a time set close to now ( -/+ 1 minute)

**Example** *(Using dot object)*  
```js
Then the response body at "user.createdAt" should equal close to now
```
**Example** *(Using json path)*  
```js
Then the response body at "$.user.list" should equal close to now
```
<a name="module_Then..bodyPropertyIsNotNull"></a>
### Then the response body at {string} should not be null
Ensure a JSON response body is not null

**Example** *(Using dot object)*  
```js
Then the response body at "user.children" should not be null
```
**Example** *(Using json path)*  
```js
Then the response body at "$.user.childern" should not be null
```
<a name="module_Then..bodyPropertyShouldMatchRegexp"></a>
### Then the response body at {string} should match {string}
Ensure a JSON response body matches a given regexp

**Example** *(Using dot object)*  
```js
Then the response body at "user.occupation" should match "/pilot/"
```
**Example** *(Using json path)*  
```js
Then the response body at "$.user.occupation" should match "/pilot/"
```
<a name="module_Then..bodyListContainNumberOfItem"></a>
### Then the response list contains {int} items
Ensure a JSON response body has an array at the root level an contains a given number of items

**Example** *(Using dot object)*  
```js
Then the response list contains "12" items
```
<a name="module_Then..saveHeaderPropertyIntoTheDataset"></a>
### Then add the value {string} from the response header to the dataset as {string}
Pick of the reponse header value and add it into the dataset storage
This will allow you to reuse value in another step

**Example**  
```js
Then add the value "Content-Type"  from the response header to the dataset as "contentType"
Given i have the api gateway
  And the header contains "Content-Type" as {{ contentTypw }}
```
<a name="module_Then..saveBodyPropertyIntoTheDataset"></a>
### Then add the value {string} from the response body to the dataset as {string}
Pick of the reponse body value and add it into the dataset storage
This will allow you to reuse value in another step

**Example** *(Using dot object)*  
```js
Then add the value "user.id"  from the response body to the dataset as "userId"
Given i have the api gateway
  And I have the path "/users/{userId}"
```
**Example** *(Using json path)*  
```js
Then add the value "$.user.id"  from the response body to the dataset as "userId"
Given i have the api gateway
  And I have the path "/users/{{userId}}"
```
<a name="module_Then..printRequest"></a>
### Then I print the request
Print the Request information (url, headers, body, method) into the console
This will allow you to debug your scenario.

**Example**  
```js
Then I print the request
```
<a name="module_Then..printResponse"></a>
### Then I print the response
Print the Response information (headers, response time,  body) into the console
This will allow you to debug your scenario.

**Example**  
```js
Then I print the response
```
<a name="module_Then..printValue"></a>
### Then I print the value {string}
Print the a specific information value into the console
This will allow you to debug your scenario.

**Example**  
```js
Then I print the value "{{ userId }}"
```
