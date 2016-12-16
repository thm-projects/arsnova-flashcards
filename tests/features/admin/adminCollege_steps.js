module.exports = function() {
    'use strict';

    this.Given(/^user is on the site$/, function () {
        browser.url('http://localhost:3000');
    });

    this.Given(/^user is logged in$/, function () {
       var SetUsername = function (name) {
		$('#TestingBackdorUsername').val(name);
	};
	client.execute(SetUsername, "testuser");
	browser.click('a[id="BackdoorLogin"]');
	browser.click('a[id="BackdoorLogin"]');
    });

    this.Given(/^user is in the back end$/, function () {
        browser.waitForExist("#adminpanel", 5000);
	browser.url('http://localhost:3000/admin/dashboard');
    });

    this.When(/^user goes to the menu item college$/, function () {
        browser.url('http://localhost:3000/admin/settings');
    });


    this.When(/^user creates a new college and course$/, function () {
        browser.waitForExist('#college',5000);
        browser.setValue('#college', 'THM');
        browser.setValue('#courseOfStudies', 'MSP');
        browser.click("#insertButton");
    });


    this.Then(/^user should see the college and course in list$/, function () {
        var college = browser.getText("#tblCollege");
        var course = browser.getText("#tblCourse");

        expect(college[college.length-1]).toEqual("THM");
        expect(course[course.length-1]).toEqual("MSP");
    });
};
