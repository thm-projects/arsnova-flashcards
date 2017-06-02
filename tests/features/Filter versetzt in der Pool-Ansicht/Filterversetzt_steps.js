


	import {login, logout} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^User is on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
	});

	this.Given(/^User is logged in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login("testuser");
	});

	this.Given(/^User is on the Filter view$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/2P6mg5iqCZ49QPPDz']",5000);
		browser.click("a[href='/cardset/2P6mg5iqCZ49QPPDz']");
		browser.waitForExist('.cardsetInfo', 5000);
	});


	this.When(/^User click on Pool$/, function () {
		browser.waitForVisible('#btnToListLayout',5000);
		browser.click('#btnToListLayout');
	});

        this.Then(/^User choose a Filter$/, function () {
		browser.waitForExist('#cardset-list', 5000);
	});
          
          this.Then(/^User should see Filter in Order$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});



	this.Then(/^User log out$/, function () {
		logout();
	});
};

// tests/features/Filterversetzt_steps.js



	
