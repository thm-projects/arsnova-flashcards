import {login, logout, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions.js";

module.exports = function () {
	'use strict';

	var title = "new-title";
	var description = "new-description";
	var module = "new-module";
	var moduleInitials = "new-short";
	var moduleID = "43";
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
		browser.waitUntil(function () {
			return browser.isVisible('#newCardSet');
		}, TIMERTHRESHOLD, 'expected new cardset button to be visible after ' + TIMERTHRESHOLDTEXT);
	});

	this.When(/^User clicks on a cardset that he owns$/, function () {
		browser.click('#set-list-region > div:nth-child(1) > a');
	});

	this.Then(/^he is shown the details of the cardset$/, function () {
		browser.waitForVisible('#editCardset', TIMERTHRESHOLD);
	});

	this.Then(/^he should push the edit cardset button$/, function () {
		browser.click('#editCardset');
	});

	this.Then(/^he should see the edit cardset form$/, function () {
		browser.waitForVisible('#editSetName', TIMERTHRESHOLD);
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		browser.waitUntil(function () {
			browser.setValue('#editSetName', title);
			return browser.getValue('#editSetName') === title;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		browser.waitUntil(function () {
			browser.setValue('#editSetDescription', description);
			return browser.getValue('#editSetDescription') === description;
		}, TIMERTHRESHOLD, 'expected text to be different after 5s');
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		browser.waitUntil(function () {
			browser.setValue('#editSetModule', module);
			return browser.getValue('#editSetModule') === module;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^he should be able to edit the module initials$/, function () {
		browser.waitUntil(function () {
			browser.setValue('#editSetModuleShort', moduleInitials);
			return browser.getValue('#editSetModuleShort') === moduleInitials;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		browser.waitUntil(function () {
			browser.setValue('#editSetModuleNum', moduleID);
			return browser.getValue('#editSetModuleNum') === moduleID;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
	});
	this.Then(/^he should be able to edit the college$/, function () {
		browser.waitForVisible('#editSetCollege',TIMERTHRESHOLD);
		browser.click('#editSetCollege');
		browser.waitForVisible('li[data="' + college + '"] a', TIMERTHRESHOLD);
		browser.click('li[data="' + college + '"] a');
	});
	this.Then(/^he should be able to edit the course$/, function () {
		browser.waitForVisible('#editSetCourse',TIMERTHRESHOLD);
		browser.click('#editSetCourse');
		browser.waitForVisible('li[data="' + course + '"] a', TIMERTHRESHOLD);
		browser.click('li[data="' + course + '"] a');
	});
	this.Then(/^he should press the save deck of cards button$/, function () {
		browser.waitForVisible('#cardSetSave',TIMERTHRESHOLD);
		browser.click('#cardSetSave');
	});
	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		browser.waitUntil(function () {
			return browser.isExisting('.modal-open') === false;
		}, TIMERTHRESHOLD, 'expected text to be different after ' + TIMERTHRESHOLDTEXT);
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

		browser.click('#cardSetCancel');
		browser.waitForVisible('#editSetName', TIMERTHRESHOLD, true);
		logout();
	});
};
