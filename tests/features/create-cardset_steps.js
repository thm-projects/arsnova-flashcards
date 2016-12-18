import {login, logout, setResolution, agreeCookies} from "./helper_functions.js"

module.exports = function (){
	'use strict';
  var cardsetsBeforeCreated = 0;

  var title = "title";
  var description = "description";
  var module = "module";
  var moduleInitials = "short";
  var moduleID = "42";
  var college = "THM";
  var course = "Informatik";


  this.Given(/^User is on the site$/, function () {
      browser.url('http://localhost:3000');
  });

  this.Given(/^User is logged in$/, function () {
      login("testuser");
      agreeCookies();
      setResolution();
      browser.windowHandleSize();
  });

  this.Given(/^User is on the my cardset view$/, function () {
      browser.url('http://localhost:3000/created')
      var bool = browser.waitForVisible('#newCardSet',10000);
      expect(bool).toBe(true);
      cardsetsBeforeCreated = browser.elements('#cardSetView > tr').value.length;
  });

	this.When(/^User clicks on the create cardset button$/, function () {
      browser.click('#newCardSet');
  });

	this.Then(/^he is redirected to the new cardset form$/, function () {
      var bool = browser.waitForVisible('#newSetModalTitle',10000);
      expect(bool).toBe(true);
  });

	this.Then(/^he should be able to edit the cardset title$/, function () {
      browser.setValue('#newSetName', title);
  });

	this.Then(/^he should be able to edit the cardset description$/, function () {
      browser.setValue('#newSetDescription', description);
  });

	this.Then(/^he should be able to edit the module name$/, function () {
      browser.setValue('#newSetModule', module)
  });

	this.Then(/^he should be able to edit the module initials$/, function () {
      browser.setValue('#newSetModuleShort', moduleInitials);
  });

	this.Then(/^he should be able to edit the module ID$/, function () {
      browser.setValue('#newSetModuleNum',moduleID);
  });

	this.Then(/^he should be able to choose a college$/, function () {
      browser.click('#newSetCollege');
      browser.waitForVisible('li[data="'+college+'"] a',5000);
      browser.click('li[data="'+college+'"] a');
  });

	this.Then(/^he should be able to choose a course$/, function () {
      browser.click('#newSetCourse');
      browser.waitForVisible('li[data="'+course+'"] a',5000);
      browser.click('li[data="Informatik"] a');
  });

	this.Then(/^he should push the create new cardset button$/, function () {
      browser.click('button.save');
  });
	
	this.Then(/^he should see the created cardset in the my cardset view with the correct values$/, function () {
      var bool = browser.waitForVisible('#cardSetView tr:nth-child(3) td a',5000);
      expect(bool).toBe(true);
      var amountCardsSets = browser.elements('#cardSetView > tr').value.length;
      expect(amountCardsSets).toBe(cardsetsBeforeCreated+1);


  });

  this.Then(/^he should select the created cardset$/, function () {
      browser.waitForVisible('#cardSetView tr:nth-child(3) td a',5000)
      browser.click('#cardSetView tr:nth-child(3) td a');
  });

  this.Then(/^he should see the details of that cardset with the correct values$/, function () {
      var bool = browser.waitForVisible('#editCardset',5000);
      expect(bool).toBe(true);

      browser.click('#editCardset');
      browser.waitForVisible('#editSetName',5000);

      expect(browser.elements('#editSetName').getAttribute("value")).toBe(title);
      expect(browser.elements('#editSetDescription').getAttribute("value")).toBe(description);
      expect(browser.elements('#editSetModule').getAttribute("value")).toBe(module);
      expect(browser.elements('#editSetModuleShort').getAttribute("value")).toBe(moduleInitials);
      expect(browser.elements('#editSetModuleNum').getAttribute("value")).toBe(moduleID);

      browser.click('#cardSetCancel');
      
      logout();
  });



};