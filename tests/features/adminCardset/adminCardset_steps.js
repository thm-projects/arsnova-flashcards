import * as global from "../../features_helper/global.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	let numberOfCardsets;


	this.Given(/^user is logged in$/, function () {
		navigation.login("editorLogin");
	});

	this.Given(/^user is in the back end$/, function () {
		navigation.switchToBackEnd(true);
	});

	this.When(/^user goes to the menu item cardsets$/, function () {
		navigation.backendCardset(true);
	});

	this.When(/^user clicks on the delete button$/, function () {
		browser.waitForExist('.delete', global.threshold);
		numberOfCardsets = browser.elements(".delete").value.length;
		navigation.clickElement(".deleteCardsetAdmin");
		navigation.clickElement("#cardetDeleteAdmin");
	});

	this.Then(/^the cardset should not be in the list anymore$/, function () {
		browser.waitForVisible("#cardsetConfirmModalAdmin", global.threshold, true);
		browser.waitForVisible('.delete');
		navigation.compareContent(".delete", --numberOfCardsets, 1);
		navigation.logoutAdmin();
	});
};
