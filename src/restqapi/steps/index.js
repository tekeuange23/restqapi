
module.exports = function ({ Given, When, Then }) {
  /*********************************************
   * GIVEN
   ********************************************/
  require('./given').forEach(step => Given.apply(this, step))

  /*********************************************
   * WHEN
   ********************************************/
  require('./when').forEach(step => When.apply(this, step))

  /*********************************************
   * THEN
   ********************************************/
  require('./then').forEach(step => Then.apply(this, step))
}
