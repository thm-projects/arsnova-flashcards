Feature: Remove flip-icon in SuperMemo

  As a user i would like to view a card in memo-modus, without seeing a flip-icon.

Background:
    Given User is on the site
    And User is logged in
    And User is on the cardset view of the testcardset

@watch
Scenario: No flip-icon
    When User clicks the Button Memo
    Then User is on the memo view of the testcardset
    Then User should not see a icon_front.png
    Then User clicks on the Button Show answer
    Then User should not see a icon_back.png
