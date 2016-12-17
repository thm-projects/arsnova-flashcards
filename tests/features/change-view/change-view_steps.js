import {login, logout, agreeCookies} from "../helper_functions";

var username = "testuser";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
		agreeCookies();
	});

	this.Given(/^He loges in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login(username);
	});

	this.Given(/^change to cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz');
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they are on the cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#cardsetInfo', 5000);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('#editCard');
	});

	this.Then(/^they see the cardlist$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#set-details-region', 5000);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('#btnToCardLayout');
	});

	this.Then(/^they se cardset again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#cardsetInfo', 5000);
	});

	this.Then(/^they log out$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
	});
};

// tests/features/change_view_steps.js
