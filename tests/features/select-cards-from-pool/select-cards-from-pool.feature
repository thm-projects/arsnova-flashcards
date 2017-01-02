Feature: Select cards from pool

  As a user i would like to select a cardset from the pool view
  
Background:
    Given User is on the site
    And User is logged in
	And User is on the pool view

Scenario: User selects cardset from pool
	When User clicks on a cardset
	Then he is shown the details of the cardset
    

