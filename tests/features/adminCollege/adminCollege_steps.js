import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	this.Given(/^user is logged in$/, function () {
		navigation.login("editorLogin");
	});

	this.Given(/^user is in the back end$/, function () {
		navigation.switchToBackEnd(true);
	});

	this.When(/^user goes to the menu item college$/, function () {
		navigation.backendCollege(true);
	});

	this.When(/^user creates a new college and course$/, function () {
		navigation.setContent('#college', 'Zulu-Universität');
		navigation.setContent('#courseOfStudies', 'Z-Kurs');
		navigation.clickElement('#insertButton');
	});

	this.Then(/^user should see the college and course in list$/, function () {
		navigation.compareContent('.tblCollege-80', 'Zulu-Universität', 0);
		navigation.compareContent('.tblCourse-80', 'Z-Kurs', 0);
		navigation.logoutAdmin();
	});
};
