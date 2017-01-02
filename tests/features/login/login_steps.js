import {login, logout, agreeCookies} from "../helper_functions";

var username = "login_testuser";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
		agreeCookies();
	});

	this.Given(/^submit the login form$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login(username);
		login(username);
	});

	this.Then(/^he should see the AGB page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#first_login_content', 5000);
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
		browser.pause(1000);
		login(username);
		browser.click('#BackdoorLogin');
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
		logout();
	});

	this.Then(/^he login again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#welcome', 5000);
		login(username);
	});

	this.Then(/^he sees the pool directly$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#pool-category-region', 8000);
	});

	this.Then(/^he logs off$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
	});
};

// tests/features/login_steps.js
