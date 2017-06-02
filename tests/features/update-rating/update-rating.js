import {login} from "../helper_functions";

module.exports = function () {
	'use strict';


	this.Given(/^I am on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^I am logged in$/, function () {
		login("testuser");
	});

	this.Given(/^I am on a cardset that I don't own and haven't rated$/, function () {
		browser.waitForExist('#pool-category-region > div:nth-child(5) > a.panelUnitBorder.field-tip', 5000);
		browser.click('#pool-category-region > div:nth-child(5) > a.panelUnitBorder.field-tip');
	});

	this.Then(/^the cardset isn't rated by me$/, function () {
		browser.waitForVisible('#userRating', 5000);
		let userRating = browser.getText('#userRating');
		expect(userRating).toEqual("0");
	});

	this.Then(/^my cardset ratings gets updated to 4$/, function () {
		browser.waitForVisible('#rating > div > div:nth-child(2) > span.star-4', 5000);
		browser.click('#rating > div > div:nth-child(2) > span.star-4');
		browser.waitForVisible('#userRating', 5000);
		let userRating = browser.getText('#userRating');
		expect(userRating).toEqual("4");
	});


	this.Then(/^my cardset ratings gets updated to 2$/, function () {
		browser.waitForExist('#rating > div > div:nth-child(4) > span.star-2', 5000);
		browser.click('#rating > div > div:nth-child(4) > span.star-2');
		browser.waitForVisible('#userRating', 5000);
		let userRating = browser.getText('#userRating');
		expect(userRating).toEqual("2");
	});
};
