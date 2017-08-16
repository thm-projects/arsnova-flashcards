import {login} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});


	/////////////////////////////////////////
	//
	// Scenario: Go to "Leitners memo box"
	//
	/////////////////////////////////////////
	this.Given(/^I am on the cardset view of the testcardset$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
		browser.click('#cardSetView tr:nth-child(2) td a');
		bool = browser.waitForVisible('#learnBox', 15000);
		expect(bool).toBe(true);
	});

	this.When(/^I click the Button Letiner's learning box$/, function () {
		browser.waitForVisible('#learnBox', 10000);
		browser.click('#learnBox');
	});


	this.Then(/^I am on the box view of the testcardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/box/bySxZuBpKZhKgB7aW");
	});

	this.Then(/^Box one contains 36 cards$/, function () {
		browser.waitForExist('#subject1 span.badge', 10000);
		var cards = browser.getText('#subject1 span.badge');
		expect(cards).toBe("36");
	});

	this.Then(/^Boxes two to five contain zero cards$/, function () {
		browser.waitForExist('#subject5 span.badge',5000);
		var cards = browser.getText('#subject2 span.badge');
		expect(cards).toBe("0");
		cards = browser.getText('#subject3 span.badge');
		expect(cards).toBe("0");
		cards = browser.getText('#subject4 span.badge');
		expect(cards).toBe("0");
		cards = browser.getText('#subject5 span.badge');
		expect(cards).toBe("0");
	});

	this.Then(/^Learned contains zero cards$/, function () {
		browser.waitForExist('#learned_card span.badge',5000);
		var cards = browser.getText('#learned_card span.badge');
		expect(cards).toBe("0");
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Leitners memo box"
	//
	/////////////////////////////////////////
	this.Given(/^I went to the box view of the testcardset$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
		browser.waitForVisible('#cardSetView tr:nth-child(2) td a',5000);
		browser.click('#cardSetView tr:nth-child(2) td a');
		bool = browser.waitForVisible('#learnBox', 15000);
		expect(bool).toBe(true);
		browser.waitForVisible('#learnBox',5000);
		browser.click('#learnBox');
	});

	this.When(/^I click on the Button Box one$/, function () {
		browser.waitForVisible('#subject1', 5000);
		browser.click('#subject1');
	});


	this.Then(/^The frontside of first card is shown$/, function () {
		browser.waitForVisible('.detailfront0', 5000);
		var text = browser.getText('.detailfront0');
		expect(text).toBe("Vorderseite für Karte Nr. 5 A: Kartensatz");
	});

	this.Then(/^I can click on the card$/, function () {
		browser.waitForExist('#cardCarousel', 5000);
		browser.click('#cardCarousel');
	});

	this.Then(/^The backside of the first card is shown$/, function () {
		browser.waitForExist('.detailback0', 5000);
		var text = browser.getText('.detailback0');
		expect(text).toBe("Rückseite für Karte Nr. 5 A: Kartensatz");
	});

	this.Then(/^I can click on the button Known$/, function () {
		browser.waitForVisible('#known', 5000);
		browser.click('#known');
	});

	this.Then(/^Box (\d+) contains 35 cards$/, function (arg1) {
		var cards = browser.getText('#subject' + arg1 + ' span.badge');
		expect(cards).toBe("35");
	});

	this.Then(/^Box (\d+) contains one card$/, function (arg1) {
		var cards = browser.getText('#subject' + arg1 + ' span.badge');
		expect(cards).toBe("1");
	});


	/////////////////////////////////////////
	//
	// Scenario: Go to "Memo"
	//
	/////////////////////////////////////////

	this.When(/^I click the Button Memo$/, function () {
		browser.waitForVisible('#learnMemo', 5000);
		browser.click('#learnMemo');
	});


	this.Then(/^I am on the memo view of the testcardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/memo/bySxZuBpKZhKgB7aW");
	});

	this.Then(/^The button Show answer is shown$/, function () {
		var button = browser.isExisting('#memoShowAnswer');
		expect(button).toBe(true);
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Memo"
	//
	/////////////////////////////////////////

	var oldVal = "";


	this.Then(/^I can click on the Button Show answer$/, function () {
		browser.waitForVisible('#memoShowAnswer',5000);
		browser.click('#memoShowAnswer');
	});


	this.Then(/^The buttons zero to five are shown$/, function () {
		browser.waitForVisible('#memoRate0',5000);
		var button = browser.isExisting('#memoRate0');
		expect(button).toBe(true);

		button = browser.isExisting('#memoRate1');
		expect(button).toBe(true);

		button = browser.isExisting('#memoRate2');
		expect(button).toBe(true);

		button = browser.isExisting('#memoRate3');
		expect(button).toBe(true);

		button = browser.isExisting('#memoRate4');
		expect(button).toBe(true);

		button = browser.isExisting('#memoRate5');
		expect(button).toBe(true);
	});

	this.Then(/^I can click button three$/, function () {
		browser.waitForVisible('#memoRate3', 5000);
		browser.waitForExist('.detailback0', 5000);
		oldVal = browser.getText('.detailback0');
		browser.click('#memoRate3');
	});

	this.Then(/^The next card is shown$/, function () {
		browser.waitForExist('.detailfront0', 5000);
		var same = (oldVal === browser.getText('.detailfront0'));
		expect(same).toBe(false);
	});
};

