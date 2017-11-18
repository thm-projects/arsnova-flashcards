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
		navigation.setContent('#college', 'THM');
		navigation.setContent('#courseOfStudies', 'WBS');
		navigation.clickElement('#insertButton');
	});

	this.Then(/^user should see the college and course in list$/, function () {
		navigation.compareContent('.tblCollege-2', 'THM', 0);
		navigation.compareContent('.tblCourse-3', 'WBS', 0);
		navigation.logoutAdmin();
	});
};
