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
		navigation.contentVisible('#newSetModalTitle');
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		navigation.setContent('#newSetName', title);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		navigation.setContent('#newSetDescription', description);
	});

	this.Then(/^he should be able to edit the module name$/, function () {
		navigation.setContent('#newSetModule', module);
	});

	this.Then(/^he should be able to edit the module initials$/, function () {
		navigation.setContent('#newSetModuleShort', moduleInitials);
	});

	this.Then(/^he should be able to edit the module ID$/, function () {
		navigation.setContent('#newSetModuleNum', moduleID);
	});

	this.Then(/^he should be able to choose a college$/, function () {
		navigation.clickElement('#newSetCollege');
		navigation.clickElement('li[data="' + college + '"] a');
	});

	this.Then(/^he should be able to choose a course$/, function () {
		navigation.clickElement('#newSetCourse');
		navigation.clickElement('li[data="' + course + '"] a');
	});

	this.Then(/^he should push the create new cardset button$/, function () {
		navigation.clickElement('.save');
	});

	this.Then(/^he should select the created cardset$/, function () {
		navigation.contentVisible('.modal-open', false);
		navigation.selectCardsetList(3);
	});

	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		navigation.clickElement('#editCardset');
		navigation.compareContent('#editSetName', title, 2, 'value');
		navigation.compareContent('#editSetDescription', description, 2, 'value');
		navigation.compareContent('#editSetModule', module, 2, 'value');
		navigation.compareContent('#editSetModuleShort', moduleInitials, 2, 'value');
		navigation.compareContent('#editSetModuleNum', moduleID, 2, 'value');
		navigation.clickElement('#cardSetCancel');
		navigation.contentVisible('#editSetName', false);
		navigation.logout();
	});
};
