module.exports = function() {
    'use strict';

    this.Given(/^I am on the site$/, function () {
        browser.url('http://localhost:3000');
    });


    this.Given(/^I am logged in$/, function () {
        var SetUsername = function (name) {
            $('#TestingBackdorUsername').val(name);
        };
        client.execute(SetUsername, "Karl Heinz2");

        browser.waitForExist('a[id="BackdoorLogin"]',10000);
        browser.click('a[id="BackdoorLogin"]');
        browser.click('a[id="BackdoorLogin"]');

        browser.waitForExist('#accept_button',10000);
        browser.click("#accept_checkbox");
        browser.click("#accept_button");
    });


    this.Given(/^I am in the back end$/, function () {
        browser.url('http://localhost:3000/admin');
    });


    this.When(/^I go to the menu item college$/, function () {
        browser.url('http://localhost:3000/admin/settings');
    });


    this.When(/^I create a new college and course$/, function () {
        browser.waitForExist('#college',10000);
        browser.setValue('#college', 'THM');
        browser.setValue('#courseOfStudies', 'MSP');
        browser.click("#insertButton");
    });


    this.Then(/^I should see the college and course in list$/, function () {
        var college = browser.getText("#tblCollege");
        var course = browser.getText("#tblCourse");

        expect(college).toEqual("THM");
        expect(course).toEqual("MSP");
    });
};
