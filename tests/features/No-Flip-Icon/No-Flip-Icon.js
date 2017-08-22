import { login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from '../helper_functions.js';

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^User is on the cardset view of the testcardset$/, function () {
		browser.waitForVisible('#cardsets', TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible('#setCreate',TIMERTHRESHOLD);
		browser.click('#setCreate');
		browser.waitUntil(function () {
			return browser.isVisible('#newCardSet');
		}, TIMERTHRESHOLD, 'expected create new cardset button to be visible after ' + TIMERTHRESHOLDTEXT);
		browser.click('#set-list-region > div:nth-child(1) > a');
		browser.waitUntil(function () {
			return browser.isVisible('#learnBox');
		}, TIMERTHRESHOLD, 'expected learn by leitner button to be visible after ' + TIMERTHRESHOLDTEXT);
	});

	/////////////////////////////////////////
	//
	// Frontside without flip-icon
	//
	/////////////////////////////////////////

	this.When(/^User clicks the Button Memo$/, function () {
		browser.waitForVisible('#learnMemo', TIMERTHRESHOLD);
		browser.click('#learnMemo');
	});

	this.Then(/^User is on the memo view of the testcardset$/, function () {
		let expectedUrl = "http://localhost:3000/memo/dTjXBmerQ6v828kZj";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^User should not see a icon_front.png$/, function () {
		browser.waitUntil(function () {
			return !browser.isExisting('#iconfront');
		}, TIMERTHRESHOLD, 'expected card front icon to not exist after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^User clicks on the Button Show answer$/, function () {
		browser.waitForVisible('#memoShowAnswer', TIMERTHRESHOLD);
		browser.click('#memoShowAnswer');
	});

	this.Then(/^User should not see a icon_back.png$/, function () {
		browser.waitUntil(function () {
			return !browser.isExisting('#iconback');
		}, TIMERTHRESHOLD, 'expected card back icon to not exist after ' + TIMERTHRESHOLDTEXT);
		logout();
	});
};
