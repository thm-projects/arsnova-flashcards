import {login, agreeCookies, logoutAdmin} from "../helper_functions";

module.exports = function () {
	'use strict';

	var numberOfCardsets = 2;

	this.Given(/^user is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^user is logged in$/, function () {
		login("testuser");
		agreeCookies();
	});

	this.Given(/^user is in the back end$/, function () {
		browser.waitForVisible('a.cc_btn.cc_btn_accept_all',5000);
		browser.click('a.cc_btn.cc_btn_accept_all');
		browser.waitForVisible("#adminpanel", 5000);
		browser.click('#adminpanel');
	});

	this.When(/^user goes to the menu item cardsets$/, function () {
		browser.waitForVisible("a[href='/admin/cardsets']",5000);
		browser.click("a[href='/admin/cardsets']");
	});

	this.When(/^user clicks on the delete button$/, function () {
		browser.waitForExist('.delete', 5000);

		browser.waitForVisible(".deleteCardsetAdmin");
		browser.click(".deleteCardsetAdmin");
		browser.waitForVisible("#cardsetConfirmModalAdmin", 5000);
		browser.click("#cardetDeleteAdmin");
	});

	this.Then(/^the cardset should not be in the list anymore$/, function () {
		browser.waitForVisible("#cardsetConfirmModalAdmin", 5000, true);

		browser.waitForVisible('.delete');
		var elements = browser.elements(".delete");
		expect(elements.value.length - 1).toEqual(numberOfCardsets - 1);

		logoutAdmin();
	});
};
