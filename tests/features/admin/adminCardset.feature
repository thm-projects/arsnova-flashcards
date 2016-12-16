Feature: Delete a cardset in the back end

  As an admin,
  so that the a cardset is not in the system anymore,
  I want to delete it in the backend.

  Background:
    Given I am on the site
    And I am logged in
    And I am in the back end

@watch
  Scenario: Admin deletes cardset
    When I go to the menu item cardsets
    And I click on the delete button
    Then the cardset should not be in the list anymore
