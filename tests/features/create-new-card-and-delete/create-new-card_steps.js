import {login, setResolution, agreeCookies} from "../helper_functions";
module.exports = function () {
	'use strict';
	var countBeforeCreated = 0;
	var countCards = 0;
	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */
	this.Given(/^User is on the poolview with username "([^"]*)"$/, function (arg1) {
		if (browser.getUrl() != "http://localhost:3000") {
			browser.url('http://localhost:3000');
		}
		login(arg1);
		setResolution();
		agreeCookies();
		browser.windowHandleSize();
	});
	this.Given(/^he is on the view of a cardset$/, function () {
		browser.waitForVisible('a.cc_btn.cc_btn_accept_all',5000);
		browser.click('a.cc_btn.cc_btn_accept_all');
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/2P6mg5iqCZ49QPPDz']",5000);
		browser.click("a[href='/cardset/2P6mg5iqCZ49QPPDz']");
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
		browser.waitForExist('#cardSave', 5000);
		browser.click('#cardSave');
	});
	this.Then(/^he should be redirected to his own cardsets view back again$/, function () {
		var currentUrl = browser.getUrl();
		var expectedUrl = "http://localhost:3000/cardset/2P6mg5iqCZ49QPPDz";
		expect(currentUrl).toEqual(expectedUrl);
	});
	this.Then(/^the card should be saved$/, function () {
		browser.waitForVisible(".carousel-inner > div",5000);
		countCards = browser.elements(".carousel-inner > div").value.length;
		expect(countBeforeCreated + 1).toEqual(countCards);
	});
	this.Then(/^the last card should be the new created one$/, function () {
		var wf = ".detailfront" + countBeforeCreated;

		var selectorFront = wf + " > p";

		browser.waitForExist(wf,5000);
		browser.waitForExist(selectorFront,5000);
		browser.waitForVisible('#leftCarouselControl');
		browser.click('#leftCarouselControl');

		var expectedFrontOfTheCard = "FRONTOFTHECARD";
		browser.waitForVisible(selectorFront);
		var frontOfTheCard = browser.getText(selectorFront);
		expect(expectedFrontOfTheCard).toEqual(frontOfTheCard);
	});
	this.Then(/^he can go back and delete the card$/, function () {
		browser.waitForVisible('#editCard',5000);
		var editButton  = browser.elements('#editCard').value[countCards - 1];
		editButton.click();
		browser.waitForVisible('#cardDelete',5000);
		var deleteButton = browser.element('#cardDelete');
		deleteButton.click();
	});
	this.Then(/^he have to confirm the delete process$/, function () {
		browser.waitForVisible('#cardConfirm',5000);
		var confirmDeleteButton = browser.element('#cardConfirm');
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
	});
};
