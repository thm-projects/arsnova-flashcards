import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	let title = "CardTitle";
	let description = "description";

	this.Given(/^User is logged in$/, function () {
		navigation.login("universityLogin");
	});

	this.Given(/^User is on the my cardset view$/, function () {
		navigation.selectMyCardset();
	});

	this.When(/^User clicks on the create cardset button$/, function () {
		navigation.newCardset(true);
	});

	this.Then(/^he is redirected to the new cardset form$/, function () {
		navigation.contentVisible('#setCardsetCourseIterationFormModalTitle');
	});

	this.Then(/^he should be able to edit the cardset title$/, function () {
		navigation.setContent('#setName', title);
	});

	this.Then(/^he should be able to edit the cardset description$/, function () {
		navigation.setContent('#contentEditor', description);
	});

	this.Then(/^he should push the create new cardset button$/, function () {
		navigation.clickElement('#cardSetSave');
	});

	this.Then(/^he should see the details of that cardset with the correct values$/, function () {
		navigation.clickElement('#editCardset');
		navigation.compareContent('#setName', title, 2, 'value');
		navigation.compareContent('#contentEditor', description, 2, 'value');
		navigation.clickElement('#cardSetCancel');
		navigation.waitForModalBackdrop();
		navigation.logout();
	});
};
