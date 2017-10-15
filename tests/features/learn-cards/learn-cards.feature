Feature: Learn Cards with leitner and wozniak

  As a user I would like to learn cards with the leitner and wozniak algorithms.


  Scenario: Learn cards with the leitner algorithm
    Given I'm logged in
    And I'm at the leitner statistics to check my progress
    Then I'll go to the leitner learning box and answer a card
    Then I'll go back to the leitner statistics view to check my progress

  Scenario: Learn cards with the wozniak algorithm
    Given I went to the super memo view of the cardset
    Then I'll answer a card
    And The algorithm should give me a new card
