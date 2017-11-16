Feature: Change view in cardset/carslist

  As a visitor, I whould change the view in cardset to cardlist and reverse.

Background:
  Given user is logged in

@watch
Scenario: Visitor can view the cardset
  When change to cardset
  Then they change the view to cardlist
  Then they change the view back to cardset
  And they log out

# tests/features/login.feature

