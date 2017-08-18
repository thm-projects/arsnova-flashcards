import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";

module.exports = function () {
	'use strict';


	this.Given(/^I am on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^I am logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^I am on a cardset that I don't own and haven't rated$/, function () {
		browser.waitForExist('#pool-category-region > div:nth-child(5) > a.panelUnitBorder.field-tip', TIMERTHRESHOLD);
		browser.click('#pool-category-region > div:nth-child(5) > a.panelUnitBorder.field-tip');
	});

	this.Then(/^the cardset isn't rated by me$/, function () {
		browser.waitForVisible('#userRating', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getText('#userRating') === '0';
		}, TIMERTHRESHOLD, 'expected rating to be 0 after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^my cardset ratings gets updated to 4$/, function () {
		browser.waitForVisible('#rating > div > div:nth-child(2) > span.star-4', TIMERTHRESHOLD);
		browser.click('#rating > div > div:nth-child(2) > span.star-4');
		browser.waitForVisible('#userRating', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getText('#userRating') === '4';
		}, TIMERTHRESHOLD, 'expected rating to be 4 after ' + TIMERTHRESHOLDTEXT);
	});


	this.Then(/^my cardset ratings gets updated to 2$/, function () {
		browser.waitForExist('#rating > div > div:nth-child(4) > span.star-2', TIMERTHRESHOLD);
		browser.click('#rating > div > div:nth-child(4) > span.star-2');
		browser.waitForVisible('#userRating', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getText('#userRating') === '2';
		}, TIMERTHRESHOLD, 'expected rating to be 2 after ' + TIMERTHRESHOLDTEXT);
		logout();
	});
};
