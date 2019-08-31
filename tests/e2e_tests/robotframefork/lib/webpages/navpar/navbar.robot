*** Settings ***
Documentation    Library file for the corresponding navpar on the topside of webpages of ARSNova cards.
...              Does contain all test functionality the user can perform on the navbar.

Resource    browser/browser.robot


*** Keywords ***
Click Logout Button On Navbar
    ${logout_btn_locator}=    Set Variable    navbar-logout
    Click Element    ${logout_btn_locator}


Open Theme Pool Dropdown On Navbar
    ${dropdown_locator}=    Set Variable    navbar-public
    Click Element    ${dropdown_locator}


Click Cardsets Theme Pool On Open Navbar Theme Pool Dropdown
    ${cardsets_locator}=    Set Variable    navbar-public-cardsets
    Click Element    ${dropdown_locator}
