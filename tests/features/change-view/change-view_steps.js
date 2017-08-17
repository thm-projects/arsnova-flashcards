import {login, logout, TIMERTHRESHOLD} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
	});

	this.Given(/^He loges in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login("standardLogin");
	});

	this.Given(/^change to cardset$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/dTjXBmerQ6v828kZj']",TIMERTHRESHOLD);
		browser.click("a[href='/cardset/dTjXBmerQ6v828kZj']");
		browser.waitForExist('.cardsetInfo', TIMERTHRESHOLD);
	});

	this.Then(/^they are on the cardset$/, function () {
		browser.waitForExist('.cardsetInfo', TIMERTHRESHOLD);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		browser.waitForVisible('#btnToListLayout',TIMERTHRESHOLD);
		browser.click('#btnToListLayout');
	});

	this.Then(/^they see the cardlist$/, function () {
		browser.waitForVisible('#cardset-list', TIMERTHRESHOLD);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		browser.waitForVisible('#btnToCardLayout',TIMERTHRESHOLD);
		browser.click('#btnToCardLayout');
	});

	this.Then(/^they see cardset again$/, function () {
		browser.waitForExist('.cardsetInfo', TIMERTHRESHOLD);
	});

	this.Then(/^they log out$/, function () {
		logout();
	});
};

// tests/features/change_view_steps.js
