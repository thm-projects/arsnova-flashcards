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
	this.Given(/^User is on the my cardset view$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
	});
	this.When(/^User clicks on a cardset that he owns$/, function () {
		browser.waitForVisible('#cardSetView tr:nth-child(1) td a',5000);
		browser.click('#cardSetView tr:nth-child(1) td a');
	});
	this.Then(/^he is shown the details of the cardset$/, function () {
		browser.waitForVisible('#editCardset', 5000);
	});
	this.Then(/^he should push the edit cardset button$/, function () {
		browser.click('#editCardset');
	});
	this.Then(/^he should see the edit cardset form$/, function () {
		browser.waitForVisible('#editSetName', 5000);
	});
	this.Then(/^he should be able to press the delete cardset button$/, function () {
		browser.waitForVisible('#cardSetDelete',5000);
		browser.click('#cardSetDelete');
	});
	this.Then(/^he should be able to press the delete cardset button again to be sure$/, function () {
		browser.waitForVisible('#cardSetConfirm',5000);
		browser.click('#cardSetConfirm');
	});
	this.Then(/^he should be returned to the my cardset view$/, function () {
		browser.waitForVisible('#cardSetView', 5000);
	});
	this.Then(/^he should not see the deleted cardset there$/, function () {
		browser.waitForExist('#cardSetView > tr',5000);
		expect(browser.elements('#cardSetView > tr').value.length).toBe(1);
		logout();
	});
};
