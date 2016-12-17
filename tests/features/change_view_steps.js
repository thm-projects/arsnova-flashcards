import {login, logout, agreeCookies, setResolution} from "./helper_functions";

var username = "testuser";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the flashcards site$/, function () {
		// Write code here that turns the phrase above into concrete actions

		browser.url('http://localhost:3000');
		browser.waitForExist("#TestingBackdorUsername", 5000);
		agreeCookies();
		browser.url('http://localhost:3000');
		browser.waitForExist("#TestingBackdorUsername", 5000);
		setResolution();
	});

	this.Then(/^He loges in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login(username);
	});

	this.Then(/^change to cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#cardsets', 5000);
		browser.click('#cardsets');
		browser.waitForExist('#set-list-region', 5000);
		browser.click('span[class="badge cardsetBadge"]');
	});

	this.Then(/^they are on the cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForVisible('#leftCarouselControl', 5000);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('#btnToListLayout');
	});

	this.Then(/^they see the cardlist$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForVisible('#set-details-region', 5000);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.click('#btnToCardLayout');
	});

	this.Then(/^they se cardset again$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#leftCarouselControl', 5000);
	});

	this.Then(/^they log out$/, function () {
		// Write code here that turns the phrase above into concrete actions
		logout();
	});
};

// tests/features/change_view_steps.js
