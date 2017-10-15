Feature: Delete a deck of cards

As a user of the site,
so that I can have more room for decks of cards,
I want to delete a deck of card

Background:
	Given User is logged in
	And User is on the my cardset view

@watch
Scenario: User deletes a owned deck of cards
	When User clicks on a cardset that he owns
	Then he is shown the details of the cardset
	And he should push the edit cardset button
	And he should see the edit cardset form
	And he should be able to press the delete cardset button
	And he should be able to press the delete cardset button again to be sure
	And he should be returned to the my cardset view
	And he should not see the deleted cardset there

