import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	var title = "new-title";
	var description = "new-description";
	var module = "new-module";
	var moduleInitials = "new-short";
	var moduleID = "43";
	var college = "Zulu-Universität";
	var course = "Z-Studiengang";

	this.Given(/^User is logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.Given(/^User is on the my cardset view$/, function () {
		navigation.selectMyCardset();
	});

	this.When(/^User clicks on a cardset that he owns$/, function () {
		navigation.selectCardsetList(1);
	});

	this.Then(/^he is shown the details of the cardset$/, function () {
		cardset.collapseCardsetInfo(false);
	});

	this.Then(/^he should push the edit cardset button$/, function () {
		navigation.clickElement('#editCardset');
	});

	this.Then(/^he should see the edit cardset form$/, function () {
		navigation.contentVisible('#setName');
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		navigation.setContent('#setName', title);
		navigation.compareContent('#setName', title, 2, 'value');
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		navigation.setContent('#setDescription', description);
		navigation.compareContent('#setDescription', description, 2, 'value');
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		navigation.setContent('#setModule', module);
		navigation.compareContent('#setModule', module, 2, 'value');
	});
	this.Then(/^he should be able to edit the module initials$/, function () {
		navigation.setContent('#setModuleShort', moduleInitials);
		navigation.compareContent('#setModuleShort', moduleInitials, 2, 'value');
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		navigation.setContent('#setModuleNum', moduleID);
		navigation.compareContent('#setModuleNum', moduleID, 2, 'value');
	});
	this.Then(/^he should be able to edit the college$/, function () {
		navigation.clickElement('#setCollege');
		navigation.clickElement('li[data="' + college + '"] a');
	});
	this.Then(/^he should be able to edit the course$/, function () {
		navigation.clickElement('#setCourse');
		navigation.clickElement('li[data="' + course + '"] a');
	});
	this.Then(/^he should press the save deck of cards button$/, function () {
		navigation.clickElement('#cardSetSave');
	});
	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		navigation.contentVisible('.modal-open',false);
		navigation.clickElement('#editCardset');
		navigation.compareContent('#setName', title, 2, 'value');
		navigation.compareContent('#setDescription', description, 2, 'value');
		navigation.compareContent('#setModule', module, 2, 'value');
		navigation.compareContent('#setModuleShort', moduleInitials, 2, 'value');
		navigation.compareContent('#setModuleNum', moduleID, 2, 'value');
		navigation.clickElement('#cardSetCancel');
		navigation.logout();
	});
};
