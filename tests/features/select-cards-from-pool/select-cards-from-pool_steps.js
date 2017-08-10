import {login, logout} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("testuser");
	});

	this.Given(/^User is on the pool view$/, function () {
		browser.pause(2000);
		browser.url('http://localhost:3000/pool');
		browser.waitForVisible('#bs-example-navbar-collapse-1', 5000);
	});

	this.When(/^User clicks on a cardset$/, function () {
		browser.waitForVisible('.poolText', 5000);
		browser.click('.poolText');
	});

	this.Then(/^he is shown the details of the cardset$/, function () {
		browser.pause(2000);
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz");

		logout();
	});
};

