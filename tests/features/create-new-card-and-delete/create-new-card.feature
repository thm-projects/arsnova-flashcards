Feature: Create a new Card and delete it
  A user to the site wants to create a new card in his own cardset
  and he wants to be able to delete it

  Scenario: Create a new card and delete it
    Given User is on the poolview with username "testuser"
    And he is on the view of a cardset
    When the user clicks on the --create a new card-- button
    And he is redirected to the --New card-- view
    And he enters a text for the subject of the card
    And he enters a text for the front of the card
    And he enters a text for the back of the card
    And he press on the save button
    Then he should be redirected to his own cardsets view back again
    And the card should be saved
    And the last card should be the new created one
    And he can go back and delete the card
    And he have to confirm the delete process
    And he should be redirected back

  Scenario: Cancel card creation
    When the user clicks on the --create a new card-- button
    And he is redirected to the --New card-- view
    Then he can press on the --Cancel-- button
    Then he should be redirected back