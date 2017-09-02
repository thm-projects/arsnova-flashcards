import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions.js";

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
		browser.waitForVisible('#cardsets', TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible('#setCreate', TIMERTHRESHOLD);
		browser.click('#setCreate');
		browser.waitUntil(function () {
			return browser.isVisible('#newCardSet');
		}, TIMERTHRESHOLD, 'expected new cardset button to be visible after ' + TIMERTHRESHOLDTEXT);
		browser.click('#set-list-region > div:nth-child(2) > a');
		browser.waitUntil(function () {
			return browser.isVisible('#learnBox');
		}, TIMERTHRESHOLD, 'expected learn by leitner button to be visible after ' + TIMERTHRESHOLDTEXT);
	});

	this.When(/^I click the Button Letiner's learning box$/, function () {
		browser.waitForVisible('#learnBox', TIMERTHRESHOLD);
		browser.click('#learnBox');
	});


	this.Then(/^I am on the box view of the testcardset$/, function () {
		let expectedUrl = "http://localhost:3000/box/bySxZuBpKZhKgB7aW";
		browser.waitUntil(function () {
			return browser.getUrl() === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^Box one contains 36 cards$/, function () {
		browser.waitForVisible('#boxChart', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.elementIdAttribute('boxChart','data-box1') === '36';
		}, TIMERTHRESHOLD, 'expected card count in box 1 to be 36 after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^Boxes two to five contain zero cards$/, function () {
		browser.waitForVisible('#boxChart', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return $('#boxChart').data('box2') === '0';
		}, TIMERTHRESHOLD, 'expected card count in box 2 to be 0 after ' + TIMERTHRESHOLDTEXT);
		browser.waitUntil(function () {
			return $('#boxChart').data('box3') === '0';
		}, TIMERTHRESHOLD, 'expected card count in box 3 to be 0 after ' + TIMERTHRESHOLDTEXT);
		browser.waitUntil(function () {
			return $('#boxChart').data('box4') === '0';
		}, TIMERTHRESHOLD, 'expected card count in box 4 to be 0 after ' + TIMERTHRESHOLDTEXT);
		browser.waitUntil(function () {
			return $('#boxChart').data('box5') === '0';
		}, TIMERTHRESHOLD, 'expected card count in box 5 to be 0 after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^Learned contains zero cards$/, function () {
		browser.waitForVisible('#boxChart', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return $('#boxChart').data('box6') === '0';
		}, TIMERTHRESHOLD, 'expected card count in box 6 to be 0 after ' + TIMERTHRESHOLDTEXT);
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Leitners memo box"
	//
	/////////////////////////////////////////
	this.Given(/^I went to the box view of the testcardset$/, function () {
		browser.waitForVisible('#cardsets', TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible('#setCreate', TIMERTHRESHOLD);
		browser.click('#setCreate');
		browser.waitUntil(function () {
			return browser.isVisible('#newCardSet');
		}, TIMERTHRESHOLD, 'expected new cardset button to be visible after ' + TIMERTHRESHOLDTEXT);
		browser.waitForVisible('#set-list-region > div:nth-child(2) > a', TIMERTHRESHOLD);
		browser.click('#set-list-region > div:nth-child(2) > a');
		browser.waitUntil(function () {
			return browser.isVisible('#learnBox');
		}, TIMERTHRESHOLD, 'expected learn by leitner button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitForVisible('#learnBox', TIMERTHRESHOLD);
		browser.click('#learnBox');
	});

	this.Then(/^The frontside of first card is shown$/, function () {
		browser.waitForVisible('.detailfront0', TIMERTHRESHOLD);
		let expectedText = "Vorderseite für Karte Nr. 5 A: Kartensatz";
		browser.waitUntil(function () {
			return browser.getText('.detailfront0') === expectedText;
		}, TIMERTHRESHOLD, 'expected front text of the card to be \'' + expectedText + '\' after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^I can click on the card$/, function () {
		browser.waitForExist('#cardCarousel', TIMERTHRESHOLD);
		browser.click('#cardCarousel');
	});

	this.Then(/^The backside of the first card is shown$/, function () {
		browser.waitForExist('.detailback0', TIMERTHRESHOLD);
		let expectedText = "Rückseite für Karte Nr. 5 A: Kartensatz";
		browser.waitUntil(function () {
			return browser.getText('.detailback0') === expectedText;
		}, TIMERTHRESHOLD, 'expected front text of the card to be \'' + expectedText + '\' after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^I can click on the button Known$/, function () {
		browser.waitForVisible('#known', TIMERTHRESHOLD);
		browser.click('#known');
	});

	this.Then(/^Box 1 contains 35 cards$/, function () {
		browser.waitForVisible('#boxChart', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return $('#boxChart').data('box1') === '35';
		}, TIMERTHRESHOLD, 'expected card count in box 1 to be 35 after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^Box 2 contains one card$/, function () {
		browser.waitForVisible('#boxChart', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return $('#boxChart').data('box2') === '1';
		}, TIMERTHRESHOLD, 'expected card count in box 2 to be 1 after ' + TIMERTHRESHOLDTEXT);
	});


	/////////////////////////////////////////
	//
	// Scenario: Go to "Memo"
	//
	/////////////////////////////////////////

	this.When(/^I click the Button Memo$/, function () {
		browser.waitForVisible('#learnMemo', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.isVisible('#learnMemo');
		}, TIMERTHRESHOLD, 'expected learn by wozniak button to be visible after 5s');
		browser.click('#learnMemo');
	});


	this.Then(/^I am on the memo view of the testcardset$/, function () {
		let currentUrl = browser.getUrl();
		let expectedUrl = "http://localhost:3000/memo/bySxZuBpKZhKgB7aW";
		browser.waitUntil(function () {
			return currentUrl === expectedUrl;
		}, TIMERTHRESHOLD, 'expected current URL to be ' + expectedUrl + ' after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^The button Show answer is shown$/, function () {
		browser.waitUntil(function () {
			return browser.isExisting('#memoShowAnswer');
		}, TIMERTHRESHOLD, 'expected memo answer button to exist after ' + TIMERTHRESHOLDTEXT);
	});


	/////////////////////////////////////////
	//
	// Scenario: Learn cards with "Memo"
	//
	/////////////////////////////////////////

	var oldVal = "";


	this.Then(/^I can click on the Button Show answer$/, function () {
		browser.waitForVisible('#memoShowAnswer', TIMERTHRESHOLD);
		browser.click('#memoShowAnswer');
	});


	this.Then(/^The buttons zero to five are shown$/, function () {
		browser.waitForVisible('#memoRate0', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.isVisible('#memoRate0');
		}, TIMERTHRESHOLD, 'expected memo rate 0 button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitUntil(function () {
			return browser.isVisible('#memoRate1');
		}, TIMERTHRESHOLD, 'expected memo rate 1 button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitUntil(function () {
			return browser.isVisible('#memoRate2');
		}, TIMERTHRESHOLD, 'expected memo rate 2 button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitUntil(function () {
			return browser.isVisible('#memoRate3');
		}, TIMERTHRESHOLD, 'expected memo rate 3 button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitUntil(function () {
			return browser.isVisible('#memoRate4');
		}, TIMERTHRESHOLD, 'expected memo rate 4 button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitUntil(function () {
			return browser.isVisible('#memoRate5');
		}, TIMERTHRESHOLD, 'expected memo rate 5 button to be visible after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^I can click button three$/, function () {
		browser.waitForVisible('#memoRate3', TIMERTHRESHOLD);
		browser.waitForExist('.detailback0', TIMERTHRESHOLD);
		oldVal = browser.getText('.detailback0');
		browser.click('#memoRate3');
	});

	this.Then(/^The next card is shown$/, function () {
		browser.waitForExist('.detailfront0', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return oldVal !== browser.getText('.detailfront0');
		}, TIMERTHRESHOLD, 'expected visible card text to be different after ' + TIMERTHRESHOLDTEXT);
		logout();
	});
};

