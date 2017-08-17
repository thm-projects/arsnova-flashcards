import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";
module.exports = function () {
	'use strict';
	var sFront,sBack;
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "standard"$/, function () {
		browser.url('http://localhost:3000');
		login("standardLogin");
	});
	this.Given(/^he is on the view of a cardset \(EaC\)$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/dTjXBmerQ6v828kZj']",TIMERTHRESHOLD);
		browser.click("a[href='/cardset/dTjXBmerQ6v828kZj']");
		browser.waitForExist(".carousel-inner", TIMERTHRESHOLD);
	});
	this.When(/^the user clicks on the edit button of the first card$/, function () {
		let editButton = browser.elements('#editCard').value[0];
		editButton.waitForVisible(TIMERTHRESHOLD);
		editButton.click();
	});
	this.Then(/^he should be on the edit view of this card$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/dTjXBmerQ6v828kZj/editcard/2byMAFYd9N2Bp9cLQ";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^he enters "([^"]*)" for the front of the card \(EaC\)$/, function (arg1) {
		let frontSelector = browser.element('#fronttext');
		frontSelector.waitForVisible();
		sFront = frontSelector.getAttribute("data-content");
		browser.setValue('#frontEditor', arg1);
	});
	this.Then(/^he enters a "([^"]*)" for the back of the card \(EaC\)$/, function (arg1) {
		let backSelector = browser.element('#backtext');
		backSelector.waitForVisible();
		sBack = backSelector.getAttribute("data-content");
		browser.setValue('#backEditor', arg1);
	});
	this.Then(/^he press on the save button \(EaC\)$/, function () {
		browser.waitForExist('#cardSave', TIMERTHRESHOLD);
		browser.click('#cardSave');
	});
	this.Then(/^he should be redirected to his own cardsets view back again \(EaC\)$/, function () {
		let expectedUrl = "http://localhost:3000/cardset/dTjXBmerQ6v828kZj";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^the front of the card should be "([^"]*)"$/, function (arg1) {
		let selectorFront = browser.element('.detailfront0');
		let expectedFrontOfTheCard = arg1;
		selectorFront.waitForVisible(TIMERTHRESHOLD);
		let frontOfTheCard = selectorFront.getText();
		browser.waitUntil(function () {
			return expectedFrontOfTheCard === frontOfTheCard;
		}, TIMERTHRESHOLD, 'expected front of the card to be ' + expectedFrontOfTheCard + ' after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^he wants to undo previous changes$/, function () {
		let editButton = browser.elements('#editCard').value[0];
		editButton.waitForVisible(TIMERTHRESHOLD);
		editButton.click();

		browser.waitForExist('#frontEditor', TIMERTHRESHOLD);
		browser.setValue('#frontEditor', sFront);
		browser.waitForExist('#backEditor', TIMERTHRESHOLD);
		browser.setValue('#backEditor', sBack);
		browser.waitForExist('#cardSave', TIMERTHRESHOLD);
		browser.click('#cardSave');
		logout();
	});
};
