Feature: Learn Cards

  As a user i would like to learn cardsets with "Leitners memo box" or "Memo" method.


  Scenario: Go to "Leitners memo box"
    Given User is on the site
    And User is logged in
    And I am on the cardset view of the testcardset
    When I click the Button Letiner's learning box
    Then I am on the box view of the testcardset
    And Box one contains 36 cards
    And Boxes two to five contain zero cards
    And Learned contains zero cards

  Scenario: Learn cards with "Leitners memo box"
    Given I went to the box view of the testcardset
    When The frontside of first card is shown
    Then I can click on the card
    And The backside of the first card is shown
    And I can click on the button Known
    And Box 1 contains 35 cards
    And Box 2 contains one card

  Scenario: Go to "Memo"
    Given I am on the cardset view of the testcardset
    When I click the Button Memo
    Then I am on the memo view of the testcardset
    And The button Show answer is shown

  Scenario: Learn cards with "Memo"
    Given I am on the cardset view of the testcardset
    When I click the Button Memo
    Then I can click on the Button Show answer
    Then The buttons zero to five are shown
    Then I can click button three
    Then The next card is shown
