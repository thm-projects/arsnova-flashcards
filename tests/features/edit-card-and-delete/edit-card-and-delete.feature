Feature: Edit a card and delete it
  A user to the site wants to be able to edit and delete a card in his cardset

  Background:
    Given User is logged in
    And he is on the view of a cardset (EaC)

  Scenario: Edit card
    When the user clicks on the edit button of the first card
    And he enters "EDITFRONT1" for the front of the card (EaC)
    And he enters a "EDITBACK1" for the back of the card (EaC)
    And he press on the save button (EaC)
    And he should be redirected to his own cardsets view back again (EaC)
    And the front of the card should be "EDITFRONT1"
    And he wants to undo previous changes
    And he should be redirected to his own cardsets view once again (EaC)
    And he wants to delete the card
    And he logs out