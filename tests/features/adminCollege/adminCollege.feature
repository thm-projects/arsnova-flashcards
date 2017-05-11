Feature: Create college and course

  As an admin,
  so that a cardset can assigned to a college and course,
  The user wants to create a college and course.

  Background:
    Given user is on the site
    And user is logged in
    And user is in the back end

@watch
  Scenario: Admin creates college and course
    When user goes to the menu item college
    And user creates a new college and course
    Then user should see the college and course in list
