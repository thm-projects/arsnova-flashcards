import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";
module.exports = function () {
	'use strict';
	var countBeforeCreated = 0;
	var countCards = 0;
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "standard"$/, function () {
		if (browser.getUrl() !== "http://localhost:3000") {
			browser.url('http://localhost:3000');
		}
		login("standardLogin");
	});
	this.Given(/^he is on the view of a cardset$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/bySxZuBpKZhKgB7aW']",TIMERTHRESHOLD);
		browser.click("a[href='/cardset/bySxZuBpKZhKgB7aW']");
		browser.waitForExist(".carousel-inner", TIMERTHRESHOLD);
		countBeforeCreated = browser.elements(".carousel-inner > div").value.length;
	});
	/**
	 * ---------------------------------------------------------------------
	 * Create a new card
	 * ---------------------------------------------------------------------
	 */
	this.When(/^the user clicks on the \-\-create a new card\-\- button$/, function () {
		browser.waitForExist('#newCardBtn', TIMERTHRESHOLD);
		browser.click('#newCardBtn');
	});
	this.When(/^he is redirected to the \-\-New card\-\- view$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/bySxZuBpKZhKgB7aW/newcard";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.When(/^he enters a text for the subject of the card$/, function () {
		browser.setValue('#subjectEditor', 'SUBJECTOFTHECARD');
	});
	this.When(/^he enters a text for the front of the card$/, function () {
		browser.setValue('#frontEditor', 'FRONTOFTHECARD');
	});
	this.When(/^he enters a text for the back of the card$/, function () {
		browser.setValue('#backEditor', 'BACKOFTHECARD');
	});
	this.When(/^he press on the save button$/, function () {
		browser.waitForExist('#cardSave', TIMERTHRESHOLD);
		browser.click('#cardSave');
	});
	this.Then(/^he should be redirected to his own cardsets view back again$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/bySxZuBpKZhKgB7aW";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^the card should be saved$/, function () {
		browser.waitForVisible(".carousel-inner > div",TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return (countBeforeCreated + 1) === (countCards = browser.elements(".carousel-inner > div").value.length);
		}, TIMERTHRESHOLD, 'expected ' + countCards + ' to be greater than ' + countBeforeCreated + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^the last card should be the new created one$/, function () {
		var wf = ".detailfront" + countBeforeCreated;

		var selectorFront = wf + " > p";

		browser.waitForExist(wf,TIMERTHRESHOLD);
		browser.waitForExist(selectorFront,TIMERTHRESHOLD);
		browser.waitForVisible('#leftCarouselControl');
		browser.click('#leftCarouselControl');

		var expectedFrontOfTheCard = "FRONTOFTHECARD";
		browser.waitForVisible(selectorFront);
		browser.waitUntil(function () {
			return expectedFrontOfTheCard === browser.getText(selectorFront);
		}, TIMERTHRESHOLD, 'expected front of the card to be ' + expectedFrontOfTheCard + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^he can go back and delete the card$/, function () {
		browser.waitForVisible('#editCard',TIMERTHRESHOLD);
		browser.elements('#editCard').value[countCards - 1].click();
		browser.waitForVisible('#cardDelete',TIMERTHRESHOLD);
		browser.click('#cardDelete');
	});
	this.Then(/^he have to confirm the delete process$/, function () {
		browser.waitForVisible('#cardDeleteConfirm',TIMERTHRESHOLD);
		browser.click('#cardDeleteConfirm');
	});
	/**
	 * ---------------------------------------------------------------------
	 * Cancel card creation
	 * ---------------------------------------------------------------------
	 */
	this.Then(/^he can press on the \-\-Cancel\-\- button$/, function () {
		browser.waitForVisible('#cardCancel', TIMERTHRESHOLD);
		browser.click('#cardCancel');
	});
	this.Then(/^he should be redirected back$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/bySxZuBpKZhKgB7aW";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^they log out$/, function () {
		logout();
	});
};
