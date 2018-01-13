import * as cardset from "../../features_helper/cardset.js";
import * as global from "../../features_helper/global.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.Given(/^I am on my own cardset$/, function () {
		navigation.selectMyCardset();
		navigation.selectCardsetLink(1);
	});

	this.When(/^I press the delete all cards button$/, function () {
		cardset.deleteAllCards(true);
	});

	this.Then(/^I get a pop-up with a warning message$/, function () {
		cardset.deleteAllCardsConfirm(false);
	});

	this.Then(/^I press the "Cancel" button$/, function () {
		cardset.deleteAllCardsCancel(true);
	});

	this.Then(/^I'm back on my cardset$/, function () {
		browser.waitForVisible(".cardNumber",global.threshold);
	});

	this.Then(/^I click the delete all cards button again$/, function () {
		cardset.deleteAllCards(true);
	});

	this.Then(/^I get a pop-up with a warning message again$/, function () {
		cardset.deleteAllCardsConfirm(false);
	});

	this.Then(/^I press "Delete all cards" button$/, function () {
		cardset.deleteAllCardsConfirm(true);
	});

	this.Then(/^I've deleted all cards$/, function () {
		browser.waitForVisible(".emptyCard",global.threshold);
		navigation.logout();
	});
};
