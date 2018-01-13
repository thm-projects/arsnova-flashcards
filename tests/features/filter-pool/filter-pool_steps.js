import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';
	let username = "standardLogin";

	/**
	 * ---------------------------------------------------------------------
	 * Background
	 * ---------------------------------------------------------------------
	 */

	this.Given(/^User is logged in$/, function () {
		navigation.login(username);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by author scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by author button$/, function () {
		navigation.selectPool();
		navigation.clickElement('a[class="dropdown-toggle authorBtn"]');
	});

	this.Then(/^he should choose an author$/, function () {
		navigation.clickElement('a[class="filterAuthor"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen author$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.poolAuthor', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by college scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by college button$/, function () {
		navigation.resetPool();
		navigation.clickElement('a[class="dropdown-toggle collegeBtn"]');
	});

	this.Then(/^he should choose a college$/, function () {
		navigation.clickElement('a[class="filterCollege"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen college$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.poolCollege', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by course scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by course button$/, function () {
		navigation.resetPool();
		navigation.clickElement('a[class="dropdown-toggle courseBtn"]');
	});

	this.Then(/^he should choose a course$/, function () {
		navigation.clickElement('a[class="filterCourse"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen course$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.poolCourse', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by module scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the filter by module button$/, function () {
		navigation.resetPool();
		navigation.clickElement('a[class="dropdown-toggle moduleBtn"]');
	});

	this.Then(/^he should choose a module$/, function () {
		navigation.clickElement('a[class="filterModule"]');
	});

	this.Then(/^he should see the cardset list sorted by the choosen module$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.poolModule', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by free license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the free license group button$/, function () {
		navigation.resetPool();
		navigation.clickElement('label[class="btn btn-default btn-info btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected free license group$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.pool-edu, .pool-pro', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by edu license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the edu license group button$/, function () {
		navigation.resetPool();
		navigation.clickElement('label[class="btn btn-default btn-success btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected edu license group$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.pool-free, .pool-pro', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});

	/**
	 * ---------------------------------------------------------------------
	 * Sort by pro license scenario
	 * ---------------------------------------------------------------------
	 */

	this.When(/^user clicks on the pro license group button$/, function () {
		navigation.resetPool();
		navigation.clickElement('label[class="btn btn-default btn-danger btn-sm active"]');
	});

	this.Then(/^he should see the cardset list filtered by the unselected pro license group$/, function () {
		let cardsetListFilteredWord = navigation.getContent('.pool-free, .pool-edu', 1);
		navigation.compareContent('.topicName', cardsetListFilteredWord, 1);
	});
	this.Then(/^they log out$/, function () {
		navigation.logout();
	});
};
