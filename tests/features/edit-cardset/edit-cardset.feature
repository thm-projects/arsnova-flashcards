Feature: Edit a deck of cards

As a user of the site,
so that I can create and learn cards,
I want to edit a deck of cards that I own

Background:
	Given User is logged in
	And User is on the my cardset view

@watch
Scenario: User edits a owned deck of cards
	When User clicks on a cardset that he owns
	Then he is shown the details of the cardset
	And he should push the edit cardset button
	And he should see the edit cardset form
	And he should be able to edit the cardset title
	And he should be able to edit the cardset description
    And he should be able to edit the module name
    And he should be able to edit the module initials
    And he should be able to edit the module ID
    And he should be able to edit the college
    And he should be able to edit the course
    And he should press the save deck of cards button
    And he should see the details of that cardset with the correct values