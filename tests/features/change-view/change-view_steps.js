<<<<<<< HEAD:tests/features/change-view/change-view_steps.js
=======



>>>>>>> unrelated to issue: Fixed the failing of CI by cleaning incorrectly formatted code, up:tests/features/Filter versetzt in der Pool-Ansicht/Filterversetzt_steps.js
import {login, logout} from "../helper_functions";

module.exports = function () {
	'use strict';

	this.Given(/^I am on the site$/, function () {
		// Write code here that turns the phrase above into concrete actions
		browser.url('http://localhost:3000');
	});

	this.Given(/^He loges in$/, function () {
		// Write code here that turns the phrase above into concrete actions
		login("testuser");
	});

	this.Given(/^change to cardset$/, function () {
		browser.waitForVisible('#cardsets',5000);
		browser.click('#cardsets');
		browser.waitForVisible("a[href='/cardset/2P6mg5iqCZ49QPPDz']",5000);
		browser.click("a[href='/cardset/2P6mg5iqCZ49QPPDz']");
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they are on the cardset$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		browser.waitForVisible('#btnToListLayout',5000);
		browser.click('#btnToListLayout');
	});

<<<<<<< HEAD:tests/features/change-view/change-view_steps.js
	this.Then(/^they see the cardlist$/, function () {
		browser.waitForExist('#cardset-list', 5000);
	});
=======
	this.Then(/^User choose a Filter$/, function () {
		browser.waitForExist('#cardset-list', 5000);
	});

	this.Then(/^User should see Filter in Order$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});
>>>>>>> unrelated to issue: Fixed the failing of CI by cleaning incorrectly formatted code, up:tests/features/Filter versetzt in der Pool-Ansicht/Filterversetzt_steps.js

	this.Then(/^they change the view back to cardset$/, function () {
		browser.waitForVisible('#btnToCardLayout',5000);
		browser.click('#btnToCardLayout');
	});

	this.Then(/^they se cardset again$/, function () {
		browser.waitForExist('.cardsetInfo', 5000);
	});

	this.Then(/^they log out$/, function () {
		logout();
	});
};

<<<<<<< HEAD:tests/features/change-view/change-view_steps.js
// tests/features/change_view_steps.js
=======
// tests/features/Filterversetzt_steps.js
>>>>>>> unrelated to issue: Fixed the failing of CI by cleaning incorrectly formatted code, up:tests/features/Filter versetzt in der Pool-Ansicht/Filterversetzt_steps.js
