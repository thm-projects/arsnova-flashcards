module.exports = function () {
 'use strict';

 this.Given(/^I am on the site$/, function () {
         // Write code here that turns the phrase above into concrete actions
	    browser.url('http://localhost:3000');
       });

 this.Given(/^submit the login form$/, function () {
         // Write code here that turns the phrase above into concrete actions
	var SetUsername = function (name) {
	  $('#TestingBackdorUsername').val(name);
	};
	client.execute(SetUsername, "Karl Heinz2");
	browser.click('a[id="BackdoorLogin"]');
	browser.click('a[id="BackdoorLogin"]');
       });

 this.Then(/^it should see the AGB$/, function () {
         // Write code here that turns the phrase above into concrete actions
         browser.waitForExist('#first_login_content');
       });
};

// tests/features/login_steps.js
