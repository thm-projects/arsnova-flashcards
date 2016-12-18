Feature: Learn Cards

  As a user i would like to learn cardsets with "Leitners memo box" or "Memo" method.
  
Background:
    Given User is on the site
    And User is logged in
    


  Scenario: Go to "Memo"
    Given I am on the cardset view of the testcardset
    When I click the Button Memo
    Then I am on the memo view of the testcardset
    And The button "Show answer" is shown

  Scenario: Learn cards with "Memo"
    Given I am on the cardset view of the testcardset
    When I click the Button Memo
    Then I can click on the Button "Show answer"
    Then The buttons 0-5 are shown
    Then I can click button 1
    Then The next card is shown
