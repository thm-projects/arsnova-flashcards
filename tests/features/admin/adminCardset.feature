Feature: Delete a cardset in the back end

  As an admin,
  so that the a cardset is not in the system anymore,
  the users wants to delete it in the backend.

  Background:
    Given user is on the site
    And the user is logged in
    And the user is in the back end

@watch
  Scenario: Admin deletes cardset
    When the user goes to the menu item cardsets
    And the user clicks on the delete button
    Then the cardset should not be in the list anymore
