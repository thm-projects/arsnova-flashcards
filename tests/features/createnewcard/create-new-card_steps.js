import {login, logout, setResolution, agreeCookies} from "./helper_functions"
module.exports = function () {
	var countBeforeCreated = 0;
	var countCards = 0;
	'use strict';
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "([^"]*)"$/, function (arg1) {
		browser.url('http://localhost:3000');
		login("testuser");
		setResolution();
		agreeCookies();
		browser.windowHandleSize();
	});
	this.Given(/^he is on the view of the cardset named \-\-test\-cards(\d+)\-\-$/, function (arg1) {
		browser.url('http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz');
		browser.waitForExist(".carousel-inner", 5000);
		countBeforeCreated = browser.elements(".carousel-inner > div").value.length;
	});
	/**
	 * ---------------------------------------------------------------------
	 * Create a new card
	 * ---------------------------------------------------------------------
	 */
	this.When(/^the user clicks on the \-\-create a new card\-\- button$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.waitForExist('#newCardBtn', 5000);
		browser.click('#newCardBtn');
	});
	this.When(/^he is redirected to the \-\-New card\-\- view$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz/newcard";
		expect(currentUrl).toEqual(expectedUrl);
	});
	this.When(/^he enters a text for the front of the card$/, function () {
		browser.setValue('#frontEditor', 'FRONTOFTHECARD');
	});
	this.When(/^he enters a text for the back of the card$/, function () {
		browser.setValue('#backEditor', 'BACKOFTHECARD');
	});
	this.When(/^he press on the "([^"]*)" button$/, function (arg1) {
		browser.waitForExist('#cardSave', 5000);
		browser.click('#cardSave');
	});
	this.Then(/^he should be redirected to his own cardsets view back again$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz";
		expect(currentUrl).toEqual(expectedUrl);
	});
	this.Then(/^the card should be saved$/, function () {
		countCards = browser.elements(".carousel-inner > div").value.length;
		expect(countBeforeCreated + 1).toEqual(countCards);
	});
	this.Then(/^the last card should be the new created one$/, function () {
		var wf = ".detailfront" + countBeforeCreated;
		var selectorFront = wf + " > p";

		browser.waitForExist(wf,5000);
		browser.click('#leftCarouselControl');
		browser.waitForVisible(wf);

		var expectedFrontOfTheCard = "FRONTOFTHECARD";
		var frontOfTheCard = browser.getText(selectorFront);
		expect(expectedFrontOfTheCard).toEqual(frontOfTheCard);
	});
	this.Then(/^he can go back and delete the card$/, function () {
		var editButton  = browser.elements('#editCard').value[countCards - 1];
		editButton.waitForVisible(5000);
		editButton.click();
		var deleteButton = browser.element('#cardDelete');
		deleteButton.click();
	});
	this.Then(/^he have to confirm the delete process$/, function () {
		var confirmDeleteButton = browser.element('#cardConfirm');
		confirmDeleteButton.waitForVisible(5000);
		confirmDeleteButton.click();
	});
	/**
	 * ---------------------------------------------------------------------
	 * Cancel card creation
	 * ---------------------------------------------------------------------
	 */
	this.Then(/^he can press on the \-\-Cancel\-\- button$/, function () {
		browser.waitForVisible('#cardCancel');
		browser.click('#cardCancel');
	});
	this.Then(/^he should be redirected back$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz";
		expect(currentUrl).toEqual(expectedUrl);
		logout();
	});
};
