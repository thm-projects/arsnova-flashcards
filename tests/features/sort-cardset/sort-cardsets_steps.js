import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";

module.exports = function () {
	'use strict';
	var isLoggedIn = false;
	var username = "standardLogin";

	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */

	this.Given(/^User is on the poolview$/, function () {
		browser.url('http://localhost:3000');
		if (!isLoggedIn) {
			login(username);
			isLoggedIn = true;
		}
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by author scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by author button$/, function () {
		browser.waitForVisible('a[class="dropdown-toggle authorBtn"]', TIMERTHRESHOLD);
		browser.click('a[class="dropdown-toggle authorBtn"]');
	});

	this.Then(/^he should choose an author$/, function () {
		browser.click('a[class="filterAuthor active"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen author$/, function () {
		let cardsetListFilteredWord = browser.elements(".poolAuthor").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries with the filtered topic after ' + TIMERTHRESHOLDTEXT);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by college scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by college button$/, function () {
		browser.waitForVisible('a[class="dropdown-toggle collegeBtn"]', TIMERTHRESHOLD);
		browser.click('a[class="dropdown-toggle collegeBtn"]');
	});

	this.Then(/^he should choose a college$/, function () {
		browser.click('a[class="filterCollege"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen college$/, function () {
		let cardsetListFilteredWord = browser.elements(".poolCollege").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries with the filtered college after ' + TIMERTHRESHOLDTEXT);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by course scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by course button$/, function () {
		browser.waitForVisible('a[class="dropdown-toggle courseBtn"]', TIMERTHRESHOLD);
		browser.click('a[class="dropdown-toggle courseBtn"]');
	});

	this.Then(/^he should choose a course$/, function () {
		browser.click('a[class="filterCourse"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen course$/, function () {
		let cardsetListFilteredWord = browser.elements(".poolCourse").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries with the filtered course after ' + TIMERTHRESHOLDTEXT);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by module scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by module button$/, function () {
		browser.waitForVisible('a[class="dropdown-toggle moduleBtn"]', TIMERTHRESHOLD);
		browser.click('a[class="dropdown-toggle moduleBtn"]');
	});

	this.Then(/^he should choose a module$/, function () {
		browser.click('a[class="filterModule"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen module$/, function () {
		let cardsetListFilteredWord = browser.elements(".poolModule").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries with the filtered module after ' + TIMERTHRESHOLDTEXT);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by module skill level
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by skill level button$/, function () {
		browser.waitForVisible('a[class="dropdown-toggle skillLevelBtn"]', TIMERTHRESHOLD);
		browser.click('a[class="dropdown-toggle skillLevelBtn"]');
	});

	this.Then(/^he should choose a skill level/, function () {
		browser.click('a[class="filterSkillLevel"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen skill level$/, function () {
		let cardsetListFilteredWord = browser.elements(".poolSkillLevel").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries with the filtered skill after ' + TIMERTHRESHOLDTEXT);
	});


	/**
	 * ---------------------------------------------------------------------
	 * Sort by free license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the free license group button$/, function () {
		browser.waitForVisible('label[class="btn btn-default btn-info btn-sm active"]', TIMERTHRESHOLD);
		browser.click('label[class="btn btn-default btn-info btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected free license group$/, function () {
		let cardsetListFilteredWord = browser.elements(".pool-edu, .pool-pro").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries without free license entries after ' + TIMERTHRESHOLDTEXT);
		browser.click('label[class="btn btn-default btn-info btn-sm"]');
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by edu license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the edu license group button$/, function () {
		browser.waitForVisible('label[class="btn btn-default btn-success btn-sm active"]', TIMERTHRESHOLD);
		browser.click('label[class="btn btn-default btn-success btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected edu license group$/, function () {
		let cardsetListFilteredWord = browser.elements(".pool-free, .pool-pro").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries without edu license entries after ' + TIMERTHRESHOLDTEXT);
		browser.click('label[class="btn btn-default btn-success btn-sm"]');
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by pro license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the pro license group button$/, function () {
		browser.waitForVisible('label[class="btn btn-default btn-danger btn-sm active"]', TIMERTHRESHOLD);
		browser.click('label[class="btn btn-default btn-danger btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected pro license group$/, function () {
		let cardsetListFilteredWord = browser.elements(".pool-free, .pool-edu").value.length;
		browser.waitUntil(function () {
			return browser.elements(".topicName").value.length === cardsetListFilteredWord;
		}, TIMERTHRESHOLD, 'expected cardset list to only contain entries without pro license entries after ' + TIMERTHRESHOLDTEXT);
		browser.click('label[class="btn btn-default btn-danger btn-sm"]');
		logout();
	});
};
