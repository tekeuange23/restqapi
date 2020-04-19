Feature: As a api consumer i can create a new user

Scenario: Successfull creation (no data variable)
Given I have the api gateway
  And I send a 'POST' request to '/users'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
  And I add the request body:
      | firstname | johnny |
      | lastname | english |
When I run the API
Then I should receive a response with the status 200
  And the response headers should contains:
      | Content-Type | application/json; charset=utf-8 |
      | Connection | close |
      | X-Powered-By | Express |
  And the response body at "$.id" should match "[a-z0-9]{8}-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12})"
  And add the value "$.id" from the response body to the databook as "id"
  And the response body at "firstname" should equal "johnny"
  And the response body at "$.lastname" should equal "english"
Given I have the api gateway
  And I send a 'GET' request to '/users/{[id]}'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
When I run the API
Then I should receive a response with the status 200
  And the response body at "$.id" should equal "{[ id ]}"
  And the response body at "firstname" should equal "johnny"
  And the response body at "$.lastname" should equal "english"
Given I have the api gateway
  And I send a 'DELETE' request to '/users/{[ id ]}'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
When I run the API
Then I should receive a response with the status 204
Given I have the api gateway
  And I send a 'GET' request to '/users/{[id]}'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
When I run the API
Then I should receive a response with the status 404
  And the response body at "code" should equal 404
  And the response body at "msg" should equal "user not found"

Scenario: Successfull creation (using restqdata)
Given I have the api gateway
  And I send a 'POST' request to '/users'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
  And I add the request body:
      | firstname | {[ users.2.firstname ]} |
      | lastname | {[ users.2.lastname ]} |
When I run the API
Then I should receive a response with the status 200
  And the response headers should contains:
      | Content-Type | application/json; charset=utf-8 |
      | Connection | close |
      | X-Powered-By | Express |
  And the response body at "firstname" should equal {[ users.2.firstname ]}
  And the response body at "$.lastname" should equal {[ users.2.lastname ]}

Scenario: Error when the firstname is missing
Given I have the api gateway
  And I send a 'POST' request to '/users'
  And I add the headers:
      | x-api-key | {[ api-key ]} |
      | Accept | */* |
  And I add the request body:
      | lastname | english |
When I run the API
Then I should receive a response with the status 406
  And the response headers should contains:
      | Content-Type | application/json; charset=utf-8 |
      | Connection | close |
      | X-Powered-By | Express |
  And the response body at "code" should equal 406
  And the response body at "msg" should equal "firstname is mandatory"

Scenario: Error when the lastname is missing
Given I have the api gateway
  And I send a 'POST' request to '/users'
  And I add the headers:
      | x-api-key | {[ api-key]} |
      | Accept | */* |
  And I add the request body:
      | firstname | english |
When I run the API
Then I should receive a response with the status 406
  And the response headers should contains:
      | Content-Type | application/json; charset=utf-8 |
      | Connection | close |
      | X-Powered-By | Express |
  And the response body at "code" should equal 406
  And the response body at "msg" should equal "lastname is mandatory"
