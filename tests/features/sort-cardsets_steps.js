module.exports = function () {
 'use strict';

    var cardsetListLength = 2;
    var isLoggedIn = false;

/** 
 * ---------------------------------------------------------------------
 * Background
 * ---------------------------------------------------------------------
 */

    this.Given(/^User is on the poolview with username "([^"]*)"$/, function (arg1) {
        browser.url('http://localhost:3000');
        if(!isLoggedIn) {
            browser.setValue('#TestingBackdorUsername', arg1);
            browser.click('a[id="BackdoorLogin"]');
            isLoggedIn = true;
        }
        browser.setViewportSize({
            width: 1920,
            height: 1080
        });
        browser.windowHandleSize();
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by author scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the filter by autor button$/, function () {
        browser.click('a[class="dropdown-toggle authorBtn"]');
    });

    this.Then(/^he should choose an author$/, function () {
        browser.click('a[class="filterAuthor active"]');
    });

    this.Then(/^he should see the cardset list sorted by the choosen author$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by college scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the filter by college button$/, function () {
        browser.click('a[class="dropdown-toggle collegeBtn"]');
    });

    this.Then(/^he should choose a college$/, function () {
        browser.click('a[class="filterCollege"]');
    });

    this.Then(/^he should see the cardset list sorted by the choosen college$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by course scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the filter by course button$/, function () {
        browser.click('a[class="dropdown-toggle courseBtn"]');
    });

    this.Then(/^he should choose a course$/, function () {
        browser.click('a[class="filterCourse"]');
    });

    this.Then(/^he should see the cardset list sorted by the choosen course$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by module scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the filter by module button$/, function () {
        browser.click('a[class="dropdown-toggle moduleBtn"]');
    });

    this.Then(/^he should choose a module$/, function () {
        browser.click('a[class="filterModule"]');
    });

    this.Then(/^he should see the cardset list sorted by the choosen module$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by free license scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the free license group button$/, function () {
        browser.click('label[class="btn btn-default btn-info active"]');
    });

    this.Then(/^he should see the cardset list filtered by the unselected free license group$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by edu license scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the edu license group button$/, function () {
        browser.click('label[class="btn btn-default btn-success active"]');
    });

    this.Then(/^he should see the cardset list filtered by the unselected edu license group$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).toEqual(cardsetListLength);
    });

/** 
 * ---------------------------------------------------------------------
 * Sort by pro license scenario
 * ---------------------------------------------------------------------
 */

    this.When(/^user clicks on the pro license group button$/, function () {
        browser.click('label[class="btn btn-default btn-danger active"]');
    });

    this.Then(/^he should see the cardset list filtered by the unselected pro license group$/, function () {
        var cardsetList = browser.elements('.cardsetInfo');
        expect(cardsetList.value.length).not.toEqual(cardsetListLength);
    });

 };