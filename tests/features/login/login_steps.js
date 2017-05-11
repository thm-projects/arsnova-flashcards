import {login, logout, setResolution, agreeCookies} from "../helper_functions";

var username = "login_testuser";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
		setResolution();
		browser.windowHandleSize();
		agreeCookies();
	});

	this.Given(/^submit the login form$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login(username);
		login(username);
	});

	this.Then(/^he should see the AGB page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#first_login_content', 15000);
	});

	this.Then(/^he can decline it$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#logout_first_login', 15000);
		browser.click('#logout_first_login');
	});

	this.Then(/^he is on the login page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#TestingBackdoorUsername',15000);
	});

	this.Then(/^he need to login again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login(username);
		login(username);
	});

	this.Then(/^he agree the AGBs$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#select_checkbox', 15000);
		browser.$('#select_checkbox').click();
		browser.waitForEnabled('#accept_button', 15000);
		browser.click('#accept_button');
	});

	this.Then(/^he see the pool page$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#pool-category-region', 15000);
	});

	this.Then(/^he log out$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
	});

	this.Then(/^he login again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#TestingBackdoorUsername',15000);
		login(username);
		login(username);
	});

	this.Then(/^he sees the pool directly$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#pool-category-region', 15000);
	});

	this.Then(/^he logs off$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
		browser.waitForExist('#TestingBackdoorUsername',15000);
	});
};

// tests/features/login_steps.js
