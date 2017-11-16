Feature: Create new deck of cards

As a user of the site,
so that I can create and learn cards,
I want to create a new deck of cards

Background:
    Given User is logged in
    And User is on the my cardset view

@watch
Scenario: User creates a new deck of cards
    When User clicks on the create cardset button
    Then he is redirected to the new cardset form
    Then he should be able to edit the cardset title
    And he should be able to edit the cardset description
    And he should be able to edit the module name
    And he should be able to edit the module initials
    And he should be able to edit the module ID
    And he should be able to choose a college
    And he should be able to choose a course
    And he should push the create new cardset button
    And he should select the created cardset
    And he should see the details of that cardset with the correct values
