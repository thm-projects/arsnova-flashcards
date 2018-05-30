Feature: Create a new Card
  A user to the site wants to create a new card in his own cardset

  Scenario: Create a new card
    Given User is on the poolview
    And he is on the view of a cardset
    When the user clicks on the --create a new card-- button
    And he is redirected to the --New card-- view
    And he enters a text for the subject of the card
    And he enters a text for the front of the card
    And he press on the save button
    Then he should be redirected to his own cardsets view back again
    And the card should be saved
    And they log out