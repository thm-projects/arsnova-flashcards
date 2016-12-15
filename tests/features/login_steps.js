var login = function () {
	var SetUsername = function (name) {
		$('#TestingBackdorUsername').val(name);
	};
	client.execute(SetUsername, "testuser");
	browser.click('a[id="BackdoorLogin"]');
	browser.click('a[id="BackdoorLogin"]');
};

/* exported firstLogin */
var firstLogin = function () {
	login();
	browser.waitForExist('#accept_checkbox', 5000);
	browser.$('#accept_checkbox').click();
	browser.click('button[id="accept_button"]');
};

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
	});

	this.Given(/^submit the login form$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login();
	});

	this.Then(/^he should see the AGB page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#first_login_content');
	});

	this.Then(/^he can decline it$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('button[id="logout_first_login"]');
	});

	this.Then(/^he is on the login page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#welcome', 5000);
	});

	this.Then(/^he need to login again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login();
	});

	this.Then(/^he agree the AGBs$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#accept_checkbox', 5000);
		browser.$('#accept_checkbox').click();
		browser.click('button[id="accept_button"]');
	});

	this.Then(/^he see the pool page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#pool-category-region', 5000);
	});

	this.Then(/^he log out$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#logout', 5000);
		browser.$('#logout').click();
	});

	this.Then(/^he login again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#welcome', 5000);
		login();
	});

	this.Then(/^he sees the pool directly$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#pool-category-region', 5000);
	});
};

// tests/features/login_steps.js
