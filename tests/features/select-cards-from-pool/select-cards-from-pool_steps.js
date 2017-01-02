import {login, logout, setResolution, agreeCookies} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("testuser");
		agreeCookies();
		setResolution();
		browser.windowHandleSize();
	});

	this.Given(/^User is on the pool view$/, function () {
		browser.url('http://localhost:3000/pool');
		browser.waitForVisible('#bs-example-navbar-collapse-1', 5000);
	});

	this.When(/^User clicks on a cardset$/, function () {
		browser.waitForVisible('.poolText', 5000);
		browser.click('.poolText');
	});

	this.Then(/^he is shown the details of the cardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz");

		logout();
	});
};

