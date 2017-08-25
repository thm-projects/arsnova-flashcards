import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^User is on the pool view$/, function () {
		let expectedUrl = "http://localhost:3000/pool";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForVisible('#bs-example-navbar-collapse-1', TIMERTHRESHOLD);
	});

	this.When(/^User clicks on a cardset$/, function () {
		browser.waitForVisible('.poolText', TIMERTHRESHOLD);
		browser.click('.poolText');
	});

	this.Then(/^he is shown the details of the cardset$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/dTjXBmerQ6v828kZj";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);

		logout();
	});
};

