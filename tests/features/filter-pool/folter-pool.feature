Feature: Filter the pool

  Background:
    Given User is logged in

  @watch
  Scenario: User sorts by card type
    When user clicks on the filter by card type button
    Then he should choose a card type
    Then he should see the cardset list sorted by the choosen card type

  @watch
  Scenario: User sorts by author
    When user clicks on the filter by author button
    Then he should choose an author
    Then he should see the cardset list sorted by the choosen author

  @watch
  Scenario: User sorts by college
    When user clicks on the filter by college button
    Then he should choose a college
    Then he should see the cardset list sorted by the choosen college

  @watch
  Scenario: User sorts by course
    When user clicks on the filter by course button
    Then he should choose a course
    Then he should see the cardset list sorted by the choosen course

  @watch
  Scenario: User sorts by module
    When user clicks on the filter by module button
    Then he should choose a module
    Then he should see the cardset list sorted by the choosen module

  @watch
  Scenario: User sorts by unselected free license group
    When user clicks on the free license group button
    Then he should see the cardset list filtered by the unselected free license group

  @watch
  Scenario: User sorts by unselected edu license group
    When user clicks on the edu license group button
    Then he should see the cardset list filtered by the unselected edu license group

  @watch
  Scenario: User sorts by unselected pro license group
    When user clicks on the pro license group button
    Then he should see the cardset list filtered by the unselected pro license group
    And they log out