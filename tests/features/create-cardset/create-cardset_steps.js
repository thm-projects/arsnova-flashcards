import {login, logout} from "../helper_functions.js";

module.exports = function () {
	'use strict';
	var cardsetsBeforeCreated = 0;

	var title = "title";
	var description = "description";
	var module = "module";
	var moduleInitials = "short";
	var moduleID = "42";
	var college = "THM";
	var course = "MSP";


	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("testuser");
	});

	this.Given(/^User is on the my cardset view$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForExist('.cardsetRow', 10000);
		cardsetsBeforeCreated = browser.elements('.cardsetRow').value.length;
	});

	this.When(/^User clicks on the create cardset button$/, function () {
		browser.waitForVisible('#newCardSet',5000);
		browser.click('#newCardSet');
	});

	this.Then(/^he is redirected to the new cardset form$/, function () {
		var bool = browser.waitForVisible('#newSetModalTitle', 10000);
		expect(bool).toBe(true);
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		browser.waitForExist('#newSetName',5000);
		browser.setValue('#newSetName', title);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		browser.waitForExist('#newSetDescription', 5000);
		browser.setValue('#newSetDescription', description);
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		browser.waitForExist('#newSetModule', 5000);
		browser.setValue('#newSetModule', module);
	});

	this.Then(/^he should be able to edit the module initials$/, function () {
		browser.waitForExist('#newSetModuleShort', 5000);
		browser.setValue('#newSetModuleShort', moduleInitials);
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		browser.waitForExist('#newSetModuleNum', 5000);
		browser.setValue('#newSetModuleNum', moduleID);
	});

	this.Then(/^he should be able to choose a college$/, function () {
		browser.waitForVisible('#newSetCollege',5000);
		browser.click('#newSetCollege');
		browser.waitForVisible('li[data="' + college + '"] a', 5000);
		browser.click('li[data="' + college + '"] a');
	});

	this.Then(/^he should be able to choose a course$/, function () {
		browser.waitForVisible('#newSetCourse',5000);
		browser.click('#newSetCourse');
		browser.waitForVisible('li[data="' + course + '"] a', 5000);
		browser.click('li[data="' + course + '"] a');
	});

	this.Then(/^he should push the create new cardset button$/, function () {
		browser.waitForVisible('button.save',5000);
		browser.click('button.save');
	});

	this.Then(/^he should see the created cardset in the my cardset view with the correct values$/, function () {
		var bool = browser.waitForVisible('#cardSetView tr:nth-child(3) td a', 5000);
		expect(bool).toBe(true);
		browser.waitForExist('.cardsetRow',5000);
		var amountCardsSets = browser.elements('.cardsetRow').value.length;
		expect(amountCardsSets).toBe(cardsetsBeforeCreated + 1);
	});

	this.Then(/^he should select the created cardset$/, function () {
		browser.waitUntil(function () {
			return browser.isExisting('.modal-open') === false;
		}, 5000, 'expected text to be different after 5s');
		browser.waitForVisible('#cardSetView tr:nth-child(3) td a', 5000);
		browser.click('#cardSetView tr:nth-child(3) td a');
	});

	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		var bool = browser.waitForVisible('#editCardset', 5000);
		expect(bool).toBe(true);

		browser.waitForVisible('#editCardset',5000);
		browser.click('#editCardset');
		browser.waitForVisible('#editSetName', 5000);

		browser.waitForExist('#editSetName',5000);
		expect(browser.elements('#editSetName').getAttribute("value")).toBe(title);
		browser.waitForExist('#editSetDescription',5000);
		expect(browser.elements('#editSetDescription').getAttribute("value")).toBe(description);
		browser.waitForExist('#editSetModule',5000);
		expect(browser.elements('#editSetModule').getAttribute("value")).toBe(module);
		browser.waitForExist('#editSetModuleShort',5000);
		expect(browser.elements('#editSetModuleShort').getAttribute("value")).toBe(moduleInitials);
		browser.waitForExist('#editSetModuleNum',5000);
		expect(browser.elements('#editSetModuleNum').getAttribute("value")).toBe(moduleID);

		browser.waitForVisible('#cardSetCancel',5000);
		browser.click('#cardSetCancel');
		browser.waitForVisible('#editSetName', 5000, true);
		logout();
	});
};
