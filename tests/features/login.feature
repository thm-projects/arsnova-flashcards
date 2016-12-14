Feature: Login with OAuth providers

  As a visitor, I need to login into the site.

Background:
  Given I am on the site

@watch
Scenario: Visitor can login
  And submit the login form
  Then he should see the AGB page
  And he can decline it
  Then he is on the login page
  And he need to login again
  And he agree the AGBs
  Then he see the pool page
  And he log out
  Then he login again
  And he sees the pool directly

# tests/features/login.feature

