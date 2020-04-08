const { Given, When, Then } = require('cucumber')
const Steps = require('./steps')

/*********************************************
 * GIVEN
 ********************************************/
Steps.given.forEach(step => Given.apply(this, step))

/*********************************************
 * WHEN
 ********************************************/
Steps.when.forEach(step => When.apply(this, step))

// Call the api

/*********************************************
 * THEN
 ********************************************/
Steps.then.forEach(step => Then.apply(this, step))
