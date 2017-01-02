import {login, logout, setResolution, agreeCookies} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("testuser");
		agreeCookies();
		setResolution();
		browser.windowHandleSize();
	});


	/////////////////////////////////////////
	//
	// Scenario: Go to "Leitners memo box"
	//
	/////////////////////////////////////////
	this.Given(/^I am on the cardset view of the testcardset$/, function () {
		browser.url('http://localhost:3000/created');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
		browser.click('#cardSetView tr:nth-child(1) td a');
		bool = browser.waitForVisible('#learnBox', 15000);
		expect(bool).toBe(true);
	});

	this.When(/^I click the Button Letiner's learning box$/, function () {
		browser.click('#learnBox');
	});


	this.Then(/^I am on the box view of the testcardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/box/2P6mg5iqCZ49QPPDz");
	});

	this.Then(/^Box (\d+) contains two cards$/, function (argv) {
		var cards = browser.getText('#subject1 span.badge');
		expect(cards).toBe("2");
	});

	this.Then(/^Boxes (\d+)\-(\d+) contain zero cards$/, function (argv, argv2) {
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
		var cards = browser.getText('#learned_card span.badge');
		expect(cards).toBe("0");

		logout();
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Leitners memo box"
	//
	/////////////////////////////////////////
	this.Given(/^I went to the box view of the testcardset$/, function () {
		browser.url('http://localhost:3000/created');
		var bool = browser.waitForVisible('#newCardSet', 15000);
		expect(bool).toBe(true);
		browser.click('#cardSetView tr:nth-child(1) td a');
		bool = browser.waitForVisible('#learnBox', 15000);
		expect(bool).toBe(true);
		browser.click('#learnBox');
	});

	this.When(/^I click on the Button Box (\d+)$/, function (arg1) {
		browser.click('#subject1');
	});


	this.Then(/^The frontside of first card is shown$/, function () {
		var text = browser.getText('.front0 p');
		expect(text).toBe("question1");
	});

	this.Then(/^I can click on the card$/, function () {
		browser.click('#cardCarousel');
	});

	this.Then(/^The backside of the first card is shown$/, function () {
		var text = browser.getText('.back0 p');
		expect(text).toBe("answer1");
	});

	this.Then(/^I can click on the button Known$/, function () {
		browser.click('#known');
	});

	this.Then(/^Box (\d+) contains one card$/, function (arg1) {
		var cards = browser.getText('#subject' + arg1 + ' span.badge');
		expect(cards).toBe("1");

		if (arg1 == 2) {
			logout();
		}
	});


	/////////////////////////////////////////
	//
	// Scenario: Go to "Memo"
	//
	/////////////////////////////////////////

	this.When(/^I click the Button Memo$/, function () {
		browser.click('#learnMemo');
	});


	this.Then(/^I am on the memo view of the testcardset$/, function () {
		var url = browser.getUrl();
		expect(url).toBe("http://localhost:3000/memo/2P6mg5iqCZ49QPPDz");
	});

	this.Then(/^The button "([^"]*)" is shown$/, function (argv) {
		var button = browser.isExisting('#memoShowAnswer');
		expect(button).toBe(true);

		logout();
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Memo"
	//
	/////////////////////////////////////////

	var oldVal = "";


	this.Then(/^I can click on the Button Show answer$/, function () {
		browser.click('#memoShowAnswer');
	});


	this.Then(/^The buttons (\d+)\-(\d+) are shown$/, function (argv1, argv2) {
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

	this.Then(/^I can click button (\d+)$/, function (argv1) {
		oldVal = browser.getText('.frontblock span p');
		browser.click('#memoRate3');
	});

	this.Then(/^The next card is shown$/, function () {
		var same = oldVal == browser.getText('.frontblock span p');
		expect(same).toBe(false);

		logout();
	});
};

