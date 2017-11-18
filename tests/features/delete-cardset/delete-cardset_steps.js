import * as global from "../../features_helper/global.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';
	let oldCardsetCount = 0;

	this.Given(/^User is logged in$/, function () {
		navigation.login("standardLogin");
	});
	this.Given(/^User is on the my cardset view$/, function () {
		navigation.selectMyCardset();
		oldCardsetCount = navigation.getContent('.cardsetRow', 1);
		navigation.contentVisible('#newCardSet');
	});
	this.When(/^User clicks on a cardset that he owns$/, function () {
		navigation.selectCardsetList(1);
	});
	this.Then(/^he is shown the details of the cardset$/, function () {
		navigation.contentVisible('#editCardset');
	});
	this.Then(/^he should push the edit cardset button$/, function () {
		navigation.clickElement('#editCardset');
	});
	this.Then(/^he should see the edit cardset form$/, function () {
		navigation.contentVisible('#editSetName');
	});
	this.Then(/^he should be able to press the delete cardset button$/, function () {
		navigation.clickElement('#cardSetDelete');
	});
	this.Then(/^he should be able to press the delete cardset button again to be sure$/, function () {
		navigation.clickElement('#cardSetConfirm');
	});
	this.Then(/^he should be returned to the my cardset view$/, function () {
		navigation.selectMyCardset();
		navigation.checkUrl(global.createRoute);
	});
	this.Then(/^he should not see the deleted cardset there$/, function () {
		navigation.compareContent('.cardsetRow', --oldCardsetCount, 1);
		navigation.logout();
	});
};
