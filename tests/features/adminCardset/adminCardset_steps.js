import {login, logoutAdmin} from "../helper_functions";

module.exports = function () {
	'use strict';

	var numberOfCardsets;

	this.Given(/^user is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^user is logged in$/, function () {
		login("editorLogin");
	});

	this.Given(/^user is in the back end$/, function () {
		browser.waitForVisible("#adminpanel", 5000);
		browser.click('#adminpanel');
	});

	this.When(/^user goes to the menu item cardsets$/, function () {
		browser.waitForVisible("a[href='/admin/cardsets']",5000);
		browser.click("a[href='/admin/cardsets']");
	});

	this.When(/^user clicks on the delete button$/, function () {
		browser.waitForExist('.delete', 5000);
		numberOfCardsets = browser.elements(".delete").value.length;
		browser.waitForVisible(".deleteCardsetAdmin");
		browser.click(".deleteCardsetAdmin");
		browser.waitForVisible("#cardsetConfirmModalAdmin", 5000);
		browser.click("#cardetDeleteAdmin");
	});

	this.Then(/^the cardset should not be in the list anymore$/, function () {
		browser.waitForVisible("#cardsetConfirmModalAdmin", 5000, true);
		browser.waitForVisible('.delete');
		let elements = browser.elements(".delete");
		expect(elements.value.length).toEqual(numberOfCardsets - 1);
		logoutAdmin();
	});
};
