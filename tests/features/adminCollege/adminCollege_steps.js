import {login, agreeCookies, logoutAdmin} from "../helper_functions";
module.exports = function () {
	'use strict';

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
		browser.click("#adminpanel");
	});

	this.When(/^user goes to the menu item college$/, function () {
		browser.waitForVisible("a[href='/admin/university']",5000);
		browser.click("a[href='/admin/university']");
	});

	this.When(/^user creates a new college and course$/, function () {
		browser.waitForExist('#college', 5000);
		browser.setValue('#college', 'THM');
		browser.setValue('#courseOfStudies', 'MSP');
		browser.waitForVisible('#insertButton');
		browser.click("#insertButton");
	});

	this.Then(/^user should see the college and course in list$/, function () {
		var college = browser.getText("#tblCollege");
		var course = browser.getText("#tblCourse");

		expect(college[college.length - 1]).toEqual("THM");
		expect(course[course.length - 1]).toEqual("MSP");

		logoutAdmin();
	});
};
