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
		browser.waitForVisible('a.cc_btn.cc_btn_accept_all',5000);
		browser.click('a.cc_btn.cc_btn_accept_all');
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/2P6mg5iqCZ49QPPDz']",5000);
		browser.click("a[href='/cardset/2P6mg5iqCZ49QPPDz']");
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they are on the cardset$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		browser.waitForVisible('#btnToListLayout',5000);
		browser.click('#btnToListLayout');
	});

	this.Then(/^they see the cardlist$/, function () {
		browser.waitForExist('#set-details-region', 5000);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		browser.waitForVisible('#btnToCardLayout',5000);
		browser.click('#btnToCardLayout');
	});

	this.Then(/^they se cardset again$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they log out$/, function () {
		logout();
	});
};

// tests/features/change_view_steps.js
