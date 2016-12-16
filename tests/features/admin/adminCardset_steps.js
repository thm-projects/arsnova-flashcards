module.exports = function() {
    'use strict';

	var numberOfCardsets = 2;

    this.Given(/^I am on the site$/, function () {
        browser.url('http://localhost:3000');
    });

    this.Given(/^I am logged in$/, function () {
       var SetUsername = function (name) {
		$('#TestingBackdorUsername').val(name);
	};
	client.execute(SetUsername, "testuser");
	browser.click('a[id="BackdoorLogin"]');
	browser.click('a[id="BackdoorLogin"]');
    });


    this.Given(/^I am in the back end$/, function () {
        browser.waitForExist("#adminpanel", 5000);
	browser.url('http://localhost:3000/admin/dashboard');
    });


    this.When(/^I go to the menu item cardsets$/, function () {
        browser.url('http://localhost:3000/admin/cardsets');
    });


    this.When(/^I click on the delete button$/, function () {
	browser.waitForExist('.delete',5000);

        browser.click(".deleteCardsetAdmin");
	browser.click("#cardetDeleteAdmin");
    });


    this.Then(/^the cardset should not be in the list anymore$/, function () {
	browser.waitForVisible("#cardsetConfirmModalAdmin", 5000, true);    	
	browser.waitForExist('.delete',5000);
	
	var elements = browser.elements(".delete");
	expect(elements.value.length-1).toEqual(numberOfCardsets-1);
    });
};
