import {login, agreeCookies, logoutAdmin} from "../helper_functions"

module.exports = function() {
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
        browser.waitForExist("#adminpanel", 5000);
	browser.url('http://localhost:3000/admin/dashboard');
    });

    this.When(/^user goes to the menu item cardsets$/, function () {
        browser.url('http://localhost:3000/admin/cardsets');
    });

    this.When(/^user clicks on the delete button$/, function () {
	browser.waitForExist('.delete',5000);

        browser.click(".deleteCardsetAdmin");
	browser.waitForVisible("#cardsetConfirmModalAdmin", 5000);
	browser.click("#cardetDeleteAdmin");
    });

    this.Then(/^the cardset should not be in the list anymore$/, function () {
	browser.waitForVisible("#cardsetConfirmModalAdmin", 5000, true);
	
	var elements = browser.elements(".delete");
	expect(elements.value.length-1).toEqual(numberOfCardsets-1);

	logoutAdmin();
    });
};
