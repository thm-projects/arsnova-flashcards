import {login, logoutAdmin, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";

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
		browser.waitForVisible("#adminpanel", TIMERTHRESHOLD);
		browser.click('#adminpanel');
	});

	this.When(/^user goes to the menu item cardsets$/, function () {
		browser.waitForVisible("a[href='/admin/cardsets']",TIMERTHRESHOLD);
		browser.click("a[href='/admin/cardsets']");
	});

	this.When(/^user clicks on the delete button$/, function () {
		browser.waitForExist('.delete', TIMERTHRESHOLD);
		numberOfCardsets = browser.elements(".delete").value.length;
		browser.waitForVisible(".deleteCardsetAdmin");
		browser.click(".deleteCardsetAdmin");
		browser.waitForVisible("#cardsetConfirmModalAdmin", TIMERTHRESHOLD);
		browser.click("#cardetDeleteAdmin");
	});

	this.Then(/^the cardset should not be in the list anymore$/, function () {
		browser.waitForVisible("#cardsetConfirmModalAdmin", TIMERTHRESHOLD, true);
		browser.waitForVisible('.delete');
		browser.waitUntil(function () {
			return browser.elements(".delete").value.length === (numberOfCardsets - 1);
		}, TIMERTHRESHOLD, 'expected cardset to be deleted after ' + TIMERTHRESHOLDTEXT);
		logoutAdmin();
	});
};
