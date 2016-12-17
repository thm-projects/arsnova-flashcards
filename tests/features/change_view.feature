Feature: Change view in cardset/carslist

  As a visitor, I whould change the view in cardset to cardlist and reverse.

Background:
  Given I am on the flashcards site

@watch
Scenario: Visitor can view the cardset
  And He loges in
  And change to cardset
  Then they are on the cardset
  And they change the view to cardlist
  Then they see the cardlist
  And they change the view back to cardset
  Then they se cardset again
  And they log out

# tests/features/login.feature

