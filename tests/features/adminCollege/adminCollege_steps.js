import {login, logoutAdmin, TIMERTHRESHOLD, TIMERTHRESHOLDTEXT} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^user is on the site$/, function () {
		browser.url('http://localhost:3000');
	});

	this.Given(/^user is logged in$/, function () {
		login("editorLogin");
	});

	this.Given(/^user is in the back end$/, function () {
		browser.waitForVisible("#adminpanel", TIMERTHRESHOLD);
		browser.click("#adminpanel");
	});

	this.When(/^user goes to the menu item college$/, function () {
		browser.waitForVisible("a[href='/admin/university']",TIMERTHRESHOLD);
		browser.click("a[href='/admin/university']");
	});

	this.When(/^user creates a new college and course$/, function () {
		browser.waitForExist('#college', TIMERTHRESHOLD);
		browser.setValue('#college', 'THM');
		browser.setValue('#courseOfStudies', 'WBS');
		browser.waitForVisible('#insertButton');
		browser.click("#insertButton");
	});

	this.Then(/^user should see the college and course in list$/, function () {
		browser.waitForExist('.tblCollege-2', TIMERTHRESHOLD);
		browser.waitUntil(function () {
			return browser.getText(".tblCollege-3") === 'THM';
		}, TIMERTHRESHOLD, 'expected College to be THM after ' + TIMERTHRESHOLDTEXT);
		browser.waitUntil(function () {
			return browser.getText(".tblCourse-3") === 'WBS';
		}, TIMERTHRESHOLD, 'expected Course to be WBS after ' + TIMERTHRESHOLDTEXT);
		logoutAdmin();
	});
};
