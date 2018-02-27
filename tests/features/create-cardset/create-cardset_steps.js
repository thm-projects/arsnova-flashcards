import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	let title = "CardTitle";
	let description = "description";
	let module = "module";
	let moduleInitials = "short";
	let moduleID = "42";
	let college = "Zulu-Universität";
	let course = "Z-Studiengang";

	this.Given(/^User is logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.Given(/^User is on the my cardset view$/, function () {
		navigation.selectMyCardset();
	});

	this.When(/^User clicks on the create cardset button$/, function () {
		navigation.newCardset(true);
	});

	this.Then(/^he is redirected to the new cardset form$/, function () {
		navigation.contentVisible('#setCardsetCourseIterationFormModalTitle');
		navigation.clickElement('#enableModule');
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		navigation.setContent('#setName', title);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		navigation.setContent('#setDescription', description);
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		navigation.setContent('#setModule', module);
	});

	this.Then(/^he should be able to edit the module initials$/, function () {
		navigation.setContent('#setModuleShort', moduleInitials);
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		navigation.setContent('#setModuleNum', moduleID);
	});

	this.Then(/^he should be able to choose a college$/, function () {
		navigation.clickElement('#setCollege');
		navigation.clickElement('li[data="' + college + '"] a');
	});

	this.Then(/^he should be able to choose a course$/, function () {
		navigation.clickElement('#setCourse');
		navigation.clickElement('li[data="' + course + '"] a');
	});

	this.Then(/^he should push the create new cardset button$/, function () {
		navigation.clickElement('#cardSetSave');
	});

	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		navigation.clickElement('#editCardset');
		navigation.compareContent('#setName', title, 2, 'value');
		navigation.compareContent('#setDescription', description, 2, 'value');
		navigation.compareContent('#setModule', module, 2, 'value');
		navigation.compareContent('#setModuleShort', moduleInitials, 2, 'value');
		navigation.compareContent('#setModuleNum', moduleID, 2, 'value');
		navigation.clickElement('#cardSetCancel');
		navigation.contentVisible('#setName', false);
		navigation.logout();
	});
};
