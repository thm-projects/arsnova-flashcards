Feature: Create college and course in back end

  As an admin,
  so that the a cardset can assigned to a college and course,
  I want to create a college and course.

  Background:
    Given I am on the site
    And I am logged in
    And I am in the back end

@watch
  Scenario: Admin create college and course
    When I go to the menu item college
    And I create a new college and course
    Then I should see the college and course in list