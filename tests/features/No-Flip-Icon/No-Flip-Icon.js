import { login } from '../helper_functions.js';

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^User is on the cardset view of the testcardset$/, function () {
		browser.waitForVisible('#cardsets', 5000);
		browser.click('#cardsets');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
		browser.click('#cardSetView tr:nth-child(1) td a');
		bool = browser.waitForVisible('#learnBox', 15000);
		expect(bool).toBe(true);
	});

	/////////////////////////////////////////
	//
	// Frontside without flip-icon
	//
	/////////////////////////////////////////

	this.When(/^User clicks the Button Memo$/, function () {
		browser.waitForVisible('#learnMemo', 5000);
		browser.click('#learnMemo');
	});

	this.Then(/^User is on the memo view of the testcardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe('http://localhost:3000/memo/dTjXBmerQ6v828kZj');
	});

	this.Then(/^User should not see a icon_front.png$/, function () {
		const doesExist = browser.waitForExist('#iconfront', 5000, true);
		expect(doesExist).toBe(true);
	});

	this.Then(/^User clicks on the Button Show answer$/, function () {
		browser.waitForVisible('#memoShowAnswer', 5000);
		browser.click('#memoShowAnswer');
	});

	this.Then(/^User should not see a icon_back.png$/, function () {
		const doesExist = browser.waitForExist('#iconback', 5000, true);
		expect(doesExist).toBe(true);
	});
};
