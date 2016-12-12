Feature: Login with OAuth providers

  As a visitor, I need to login into the site.

Background:
  Given I am on the site

@watch
Scenario: Visitor can login
  And submit the login form
  Then it should see the AGB

# tests/features/login.feature

