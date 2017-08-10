Feature: Delete all Cards

As a user on the site,
I want to delete all cards from a cardset
so that nothing is left

Background:
Given I am on the site
And I am logged in
And I am on my own cardset

@watch
Scenario: User wants to delete all cards
When I press the delete all cards button
Then I get a pop-up with a warning message
And I press the "Cancel" button
Then I'm back on my cardset
And I click the delete all cards button again
Then I get a pop-up with a warning message again
And I press "Delete all cards" button
Then I've deleted all cards
