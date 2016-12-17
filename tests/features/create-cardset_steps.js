import {login, logout, setResolution, agreeCookies} from "./helper_functions.js"

module.exports = function (){
	'use strict';

  this.Given(/^User is on the site$/, function () {
      browser.url('http://localhost:3000');
  });

  this.Given(/^User is logged in$/, function () {
      login("testuser");
      agreeCookies();
  });

  this.Given(/^User is on the my cardset view$/, function () {
    browser.url('http://localhost:3000/created')
  });

	this.When(/^User clicks on the create cardset button$/, function () {
      // newCardSet
      browser.waitForVisible('#newCardSet',10000);
      browser.click('#newCardSet');
  });

	this.Then(/^he is redirected to the new cardset form$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to edit the cardset title$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to edit the cardset description$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to edit the module name$/, function () {
      // Write code here that turns the phrase above into concrete actions
         return 'pending';
  });

	this.Then(/^he should be able to edit the module initials$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to edit the module ID$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to choose a college$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should be able to choose a course$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });

	this.Then(/^he should push the create new cardset button$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });
	
	this.Then(/^he should see the created cardset in the my cardset view with the correct values$/, function () {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
  });




};