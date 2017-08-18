import {login, logout, TIMERTHRESHOLD} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^He loges in$/, function () {
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

	this.Then(/^they start the SuperMemo mode$/, function () {
		browser.waitForVisible('#learnMemo',TIMERTHRESHOLD);
		browser.click('#learnMemo');
	});

	this.Then(/^they see the SuperMemo view$/, function () {
		browser.waitForExist('#memoFlashcard', TIMERTHRESHOLD);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		browser.waitForVisible('#back-button',TIMERTHRESHOLD);
		browser.click('#back-button');
	});

	this.Then(/^they see the cardset again$/, function () {
		browser.waitForExist('.cardsetInfo', TIMERTHRESHOLD);
	});

	this.Then(/^they log out$/, function () {
		logout();
	});
};

// tests/features/change_view_steps.js
