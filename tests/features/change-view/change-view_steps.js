import {login, logout, agreeCookies, setResolution} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
	});

	this.Given(/^He loges in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.pause(1000);
		login("testuser");
		agreeCookies();
		setResolution();
	});

	this.Given(/^change to cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.pause(2000);
		browser.url('http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz');
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they are on the cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('#btnToListLayout');
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
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they log out$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
	});
};

// tests/features/change_view_steps.js
