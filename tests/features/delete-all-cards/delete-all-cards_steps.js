import {login, logout, TIMERTHRESHOLD} from "../helper_functions";
module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^I am logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^I am on my own cardset$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible('#cardSetView tr:nth-child(1) td a',TIMERTHRESHOLD);
		browser.click('#cardSetView tr:nth-child(1) td a');
	});

	this.When(/^I press the delete all cards button$/, function () {
		browser.waitForVisible('#delete_cards',TIMERTHRESHOLD);
		browser.click('#delete_cards');
	});

	this.Then(/^I get a pop-up with a warning message$/, function () {
		browser.waitForVisible('#deleteCardsConfirm',TIMERTHRESHOLD);
	});

	this.Then(/^I press the "Cancel" button$/, function () {
		browser.click('#deleteCardsCancel');
		browser.waitForVisible(".cardNumber",TIMERTHRESHOLD);
	});

	this.Then(/^I'm back on my cardset$/, function () {
		browser.waitForVisible(".cardNumber",TIMERTHRESHOLD);
	});

	this.Then(/^I click the delete all cards button again$/, function () {
		browser.waitForVisible('#delete_cards',TIMERTHRESHOLD);
		browser.click('#delete_cards');
	});

	this.Then(/^I get a pop-up with a warning message again$/, function () {
		browser.waitForVisible('#deleteCardsConfirm',TIMERTHRESHOLD);
	});

	this.Then(/^I press "Delete all cards" button$/, function () {
		browser.click('#deleteCardsConfirm');
	});

	this.Then(/^I've deleted all cards$/, function () {
		browser.waitForVisible(".emptyCard",TIMERTHRESHOLD);
		logout();
	});
};
