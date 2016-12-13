Feature: Learn Cards

  As a user i would like to learn cardsets with "Leitners memo box" or "Memo" method.
  
  Background:
    Given I am logged in as testuser And I have created a testcardset with 2 cards.
    
  Scenario: Go to "Leitners memo box"
    Given I am on the cardset view of the testcardset
    When I click the Button "Letiner's learning box"
    Then I am on the box view of the testcardset
    And Box 1 contains two cards
    And Boxes 2-5 contain zero cards
    And Learned contains zero cards
    
  Scenario: Learn cards with "Leitners memo box"
    Given I am on the box view of the testcardset
    When I click on the Button "Box 1"
    Then The frontside of first card is shown
    When I click on the card
    Then The backside of the first card is shown
    When I clck on the button "Known"
    Then Box 1 contains one card
    And Box 2 contains one card
    
  Scenario: Go to "Memo"
    Given I am on the cardset view of the testcardset
    When I click the Button "Memo"
    Then I am on the memo view of the testcardset
    And The frontside of first card is shown
    And The button "Show answer" is shown
    
  Scenario: Learn cards with "Memo"
    Given I am on the memo view of the testcardset
    When I click on the Button "Show answer"
    Then The buttons 0-5 are shown
    When I click any of this buttons
    Then The next card is shown