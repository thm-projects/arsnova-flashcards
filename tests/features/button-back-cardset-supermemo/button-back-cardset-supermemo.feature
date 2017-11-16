Feature: Button Back to cardset in SuperMemo

	As a user of the site, I want a back button in the SuperMemo learning mode, so I can go back to my cardset.

Background:
	Given user is logged in

@watch
Scenario: Visitor can view the cardset
	When change to cardset
	Then they are on the cardset
	And they start the SuperMemo mode
	Then they see the SuperMemo view
	And they change the view back to cardset
	Then they see the cardset again
	And they log out

# tests/features/change-view.feature

