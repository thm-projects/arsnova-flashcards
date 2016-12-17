Feature: Create a new Card
  As an user to the site, i want to create a new card in my own cardset

  Background:
    Given User is on the poolview with username "testuser"
    And he is on the view of the cardset named --test-cards1--

  Scenario: Create a new card
    When the user clicks on the --create a new card-- button
    And he is redirected to the --New card-- view
    And he enters a text for the front of the card
    And he enters a text for the back of the card
    And he press on the "Save" button
    Then he should be redirected to his own cardsets view back again
    And the card should be saved
    And the last card should be the new created one

  Scenario: Cancel card creation
    When the user clicks on the --create a new card-- button
    And he is redirected to the --New card-- view
    Then he can press on the --Cancel-- button
    Then he should be redirected back