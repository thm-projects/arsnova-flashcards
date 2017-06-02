import {login, logoutAdmin} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^user is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^user is logged in$/, function () {
		login("testuser");
	});

	this.Given(/^user is in the back end$/, function () {
		browser.waitForVisible("#adminpanel", 5000);
		browser.click("#adminpanel");
	});

	this.When(/^user goes to the menu item college$/, function () {
		browser.waitForVisible("a[href='/admin/university']",5000);
		browser.click("a[href='/admin/university']");
	});

	this.When(/^user creates a new college and course$/, function () {
		browser.waitForExist('#college', 5000);
		browser.setValue('#college', 'THM');
		browser.setValue('#courseOfStudies', 'WBS');
		browser.waitForVisible('#insertButton');
		browser.click("#insertButton");
	});

	this.Then(/^user should see the college and course in list$/, function () {
		browser.waitForExist('.tblCollege-2', 5000);
		var college = browser.getText(".tblCollege-2");
		var course = browser.getText(".tblCourse-2");

		expect(college).toEqual("THM");
		expect(course).toEqual("WBS");

		logoutAdmin();
	});
};
