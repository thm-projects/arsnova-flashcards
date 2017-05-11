import {login, logout, setResolution, agreeCookies} from "../helper_functions";
module.exports = function () {
	'use strict';
	var sFront,sBack;
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "([^"]*)" \(EaC\)$/, function (arg1) {
		browser.url('http://localhost:3000');
		login(arg1);
		setResolution();
		agreeCookies();
		browser.windowHandleSize();
	});
	this.Given(/^he is on the view of a cardset \(EaC\)$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/2P6mg5iqCZ49QPPDz']",5000);
		browser.click("a[href='/cardset/2P6mg5iqCZ49QPPDz']");
		browser.waitForExist(".carousel-inner", 5000);
	});
	this.When(/^the user clicks on the edit button of the first card$/, function () {
		var editButton = browser.elements('#editCard').value[0];
		editButton.waitForVisible(5000);
		editButton.click();
	});
	this.Then(/^he should be on the edit view of this card$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz/editcard/84omt45zeyky5hNMX";
		expect(currentUrl).toEqual(expectedUrl);
	});
	this.Then(/^he enters "([^"]*)" for the front of the card \(EaC\)$/, function (arg1) {
		var frontSelector = browser.element('#fronttext');
		frontSelector.waitForVisible();
		sFront = frontSelector.getAttribute("data-content");
		browser.setValue('#frontEditor', arg1);
	});
	this.Then(/^he enters a "([^"]*)" for the back of the card \(EaC\)$/, function (arg1) {
		var backSelector = browser.element('#backtext');
		backSelector.waitForVisible();
		sBack = backSelector.getAttribute("data-content");
		browser.setValue('#backEditor', arg1);
	});
	this.Then(/^he press on the save button \(EaC\)$/, function () {
		browser.waitForExist('#cardSave', 5000);
		browser.click('#cardSave');
	});
	this.Then(/^he should be redirected to his own cardsets view back again \(EaC\)$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz";
		expect(currentUrl).toEqual(expectedUrl);
	});
	this.Then(/^the front of the card should be "([^"]*)"$/, function (arg1) {
		var selectorFront = browser.element('.detailfront0');
		var expectedFrontOfTheCard = arg1;
		selectorFront.waitForVisible(5000);
		var frontOfTheCard = selectorFront.getText();
		expect(expectedFrontOfTheCard).toEqual(frontOfTheCard);
	});
	this.Then(/^he wants to undo previous changes$/, function () {
		var editButton = browser.elements('#editCard').value[0];
		editButton.waitForVisible(5000);
		editButton.click();

		browser.waitForExist('#frontEditor', 5000);
		browser.setValue('#frontEditor', sFront);
		browser.waitForExist('#backEditor', 5000);
		browser.setValue('#backEditor', sBack);
		browser.waitForExist('#cardSave', 5000);
		browser.click('#cardSave');
		logout();
	});
};
