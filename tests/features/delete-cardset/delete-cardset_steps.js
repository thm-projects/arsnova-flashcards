import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions.js";

module.exports = function () {
	'use strict';
	let oldCardsetCount = 0;

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});
	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});
	this.Given(/^User is on the my cardset view$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		oldCardsetCount = browser.elements('#cardSetView > tr').value.length;
		browser.waitUntil(function () {
			return browser.isVisible('#newCardSet');
		}, TIMERTHRESHOLD, 'expected create new cardset button to be visible after ' + TIMERTHRESHOLDTEXT);
	});
	this.When(/^User clicks on a cardset that he owns$/, function () {
		browser.waitForVisible('#cardSetView tr:nth-child(1) td a',TIMERTHRESHOLD);
		browser.click('#cardSetView tr:nth-child(1) td a');
	});
	this.Then(/^he is shown the details of the cardset$/, function () {
		browser.waitForVisible('#editCardset', TIMERTHRESHOLD);
	});
	this.Then(/^he should push the edit cardset button$/, function () {
		browser.click('#editCardset');
	});
	this.Then(/^he should see the edit cardset form$/, function () {
		browser.waitForVisible('#editSetName', TIMERTHRESHOLD);
	});
	this.Then(/^he should be able to press the delete cardset button$/, function () {
		browser.waitForVisible('#cardSetDelete',TIMERTHRESHOLD);
		browser.click('#cardSetDelete');
	});
	this.Then(/^he should be able to press the delete cardset button again to be sure$/, function () {
		browser.waitForVisible('#cardSetConfirm',TIMERTHRESHOLD);
		browser.click('#cardSetConfirm');
	});
	this.Then(/^he should be returned to the my cardset view$/, function () {
		browser.waitForVisible('#cardSetView', TIMERTHRESHOLD);
	});
	this.Then(/^he should not see the deleted cardset there$/, function () {
		browser.waitForExist('#cardSetView > tr',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.elements('#cardSetView > tr').value.length ===  (oldCardsetCount - 1);
		}, TIMERTHRESHOLD, 'expected cardset to be deleted after ' + TIMERTHRESHOLDTEXT);
		logout();
	});
};
