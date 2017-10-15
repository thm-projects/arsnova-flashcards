Feature: Update the rating

As a user,
I want to have the ability to update my rating,
on cardsets that I don't own.

Background:
  Given User is logged in
  And I am on a cardset that I don't own and haven't rated

@watch
Scenario: I want to change my rating 2 times
  When the cardset isn't rated by me
  Then my cardset ratings gets updated to 4
  Then my cardset ratings gets updated to 2