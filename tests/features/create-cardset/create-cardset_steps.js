import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions.js";

module.exports = function () {
	'use strict';
	var cardsetsBeforeCreated = 0;

	var title = "CardTitle";
	var description = "description";
	var module = "module";
	var moduleInitials = "short";
	var moduleID = "42";
	var college = "Zulu-Universität";
	var course = "Z-Studiengang";


	this.Given(/^User is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		login("standardLogin");
	});

	this.Given(/^User is on the my cardset view$/, function () {
		browser.waitForVisible('#cardsets',TIMERTHRESHOLD);
		browser.click('#cardsets');
		browser.waitForVisible('#setCreate',TIMERTHRESHOLD);
		browser.click('#setCreate');
		browser.waitForExist('.cardsetRow', TIMERTHRESHOLD);
		cardsetsBeforeCreated = browser.elements('.cardsetRow').value.length;
	});

	this.When(/^User clicks on the create cardset button$/, function () {
		browser.waitForVisible('#newCardSet',TIMERTHRESHOLD);
		browser.click('#newCardSet');
	});

	this.Then(/^he is redirected to the new cardset form$/, function () {
		browser.waitUntil(function () {
			return browser.isVisible('#newSetModalTitle');
		}, TIMERTHRESHOLD, 'expected Title to be visible after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		browser.waitForExist('#newSetName',TIMERTHRESHOLD);
		browser.setValue('#newSetName', title);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		browser.waitForExist('#newSetDescription', TIMERTHRESHOLD);
		browser.setValue('#newSetDescription', description);
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		browser.waitForExist('#newSetModule', TIMERTHRESHOLD);
		browser.setValue('#newSetModule', module);
	});

	this.Then(/^he should be able to edit the module initials$/, function () {
		browser.waitForExist('#newSetModuleShort', TIMERTHRESHOLD);
		browser.setValue('#newSetModuleShort', moduleInitials);
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		browser.waitForExist('#newSetModuleNum', TIMERTHRESHOLD);
		browser.setValue('#newSetModuleNum', moduleID);
	});

	this.Then(/^he should be able to choose a college$/, function () {
		browser.waitForVisible('#newSetCollege',TIMERTHRESHOLD);
		browser.click('#newSetCollege');
		browser.waitForVisible('li[data="' + college + '"] a', TIMERTHRESHOLD);
		browser.click('li[data="' + college + '"] a');
	});

	this.Then(/^he should be able to choose a course$/, function () {
		browser.waitForVisible('#newSetCourse',TIMERTHRESHOLD);
		browser.click('#newSetCourse');
		browser.waitForVisible('li[data="' + course + '"] a', TIMERTHRESHOLD);
		browser.click('li[data="' + course + '"] a');
	});

	this.Then(/^he should push the create new cardset button$/, function () {
		browser.waitForVisible('button.save',TIMERTHRESHOLD);
		browser.click('button.save');
	});

	this.Then(/^he should see the created cardset in the my cardset view with the correct values$/, function () {
		browser.waitUntil(function () {
			return browser.isVisible('#set-list-region > div:nth-child(3) > a');
		}, TIMERTHRESHOLD, 'expected Cardset to appear in my cardset after ' + TIMERTHRESHOLDTEXT);
		browser.waitForExist('.cardsetRow',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.elements('.cardsetRow').value.length === (cardsetsBeforeCreated + 1);
		}, TIMERTHRESHOLD, 'expected Cardset to appear in my cardset after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^he should select the created cardset$/, function () {
		browser.waitUntil(function () {
			return browser.isExisting('.modal-open') === false;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
		browser.waitForVisible('#set-list-region > div:nth-child(3) > a', TIMERTHRESHOLD);
		browser.click('#set-list-region > div:nth-child(3) > a');
	});

	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		browser.waitUntil(function () {
			return browser.isVisible('#editCardset');
		}, TIMERTHRESHOLD, 'expected edit card button to be visible after ' + TIMERTHRESHOLDTEXT);

		browser.waitForVisible('#editCardset',TIMERTHRESHOLD);
		browser.click('#editCardset');
		browser.waitForVisible('#editSetName', TIMERTHRESHOLD);

		browser.waitForExist('#editSetName',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getAttribute('#editSetName', 'value') === title;
		}, TIMERTHRESHOLD, 'expected cardset name to be ' + title + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForExist('#editSetDescription',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getAttribute('#editSetDescription', 'value') === description;
		}, TIMERTHRESHOLD, 'expected cardset name to be ' + description + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForExist('#editSetModule',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getAttribute('#editSetModule', 'value') === module;
		}, TIMERTHRESHOLD, 'expected cardset name to be ' + module + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForExist('#editSetModuleShort',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getAttribute('#editSetModuleShort', 'value') === moduleInitials;
		}, TIMERTHRESHOLD, 'expected cardset name to be ' + moduleInitials + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForExist('#editSetModuleNum',TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getAttribute('#editSetModuleNum', 'value') === moduleID;
		}, TIMERTHRESHOLD, 'expected cardset name to be ' + moduleID + ' after ' + TIMERTHRESHOLDTEXT);
		browser.waitForVisible('#cardSetCancel',TIMERTHRESHOLD);
		browser.click('#cardSetCancel');
		browser.waitForVisible('#editSetName', TIMERTHRESHOLD, true);
		logout();
	});
};
