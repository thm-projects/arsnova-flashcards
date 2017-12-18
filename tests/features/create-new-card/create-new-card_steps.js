import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';
	var countBeforeCreated = 0;
	var url;
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "standard"$/, function () {
		navigation.login("standardLogin");
	});
	this.Given(/^he is on the view of a cardset$/, function () {
		navigation.selectMyCardset();
		countBeforeCreated = navigation.selectCardsetList(3);
		navigation.contentVisible(".carousel-inner");
	});
	/**
	 * ---------------------------------------------------------------------
	 * Create a new card
	 * ---------------------------------------------------------------------
	 */
	this.When(/^the user clicks on the \-\-create a new card\-\- button$/, function () {
		url = browser.getUrl();
		cardset.newCard();
	});
	this.When(/^he is redirected to the \-\-New card\-\- view$/, function () {
		navigation.compareUrl(url + '/newcard', browser.getUrl());
	});
	this.When(/^he enters a text for the subject of the card$/, function () {
		navigation.setContent('#subjectEditor', 'SUBJECTOFTHECARD');
	});
	this.When(/^he enters a text for the front of the card$/, function () {
		navigation.setContent('#contentEditor', 'FRONTOFTHECARD');
	});
	this.When(/^he enters a text for the back of the card$/, function () {
		navigation.clickElement('#editBack');
		navigation.setContent('#contentEditor', 'BACKOFTHECARD');
	});
	this.When(/^he press on the save button$/, function () {
		cardset.saveCardReturn();
	});
	this.Then(/^he should be redirected to his own cardsets view back again$/, function () {
		cardset.newCard(false);
		navigation.compareUrl(url, browser.getUrl());
	});
	this.Then(/^the card should be saved$/, function () {
		navigation.clickElement("#leftCarouselControl");
		navigation.compareContent(".detailfront" + countBeforeCreated, "FRONTOFTHECARD", 0);
	});
	/**
	 * ---------------------------------------------------------------------
	 * Cancel card creation
	 * ---------------------------------------------------------------------
	 */
	this.Then(/^he can press on the \-\-Cancel\-\- button$/, function () {
		cardset.cancelCardEdit();
	});
	this.Then(/^he should be redirected back$/, function () {
		navigation.compareUrl(url, browser.getUrl());
	});
	this.Then(/^they log out$/, function () {
		navigation.logout();
	});
};
