Feature: Edit a card
  A user to the site wants to be able to edit a card in his cardset

  Background:
    Given User is on the poolview with username "testuser" (EaC)
    And he is on the view of the cardset named --test-cards1-- (EaC)

  Scenario: Edit card
    When the user clicks on the edit button of the first card
    Then he should be on the edit view of this card
    And he enters "EDITFRONT1" for the front of the card (EaC)
    And he enters a "EDITBACK1" for the back of the card (EaC)
    And he press on the save button (EaC)
    And he should be redirected to his own cardsets view back again (EaC)
    And the front of the card should be "EDITFRONT1"
    And he wants to undo previous changes