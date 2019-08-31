*** Settings ***
Documentation    Library file for the corresponding homepage of ARSNova cards.
...              Does contain all test functionality the user can perform on the homepage.

Resource    browser/browser.robot


*** Keywords ***
Home Page Is Shown
    [Documentation]    Validates that the Homepage is shown in the browser.
    ...                Will throw an error otherwise.

    Location Should Be    ${ENV_CARDS_URL}/home

    ${login_with_role_selection_btn_locator}=    Set Variable    BackdoorLogin
    Element Should Be Visible    ${login_with_role_selection_btn_locator}


Go To Home Page
    Go To    ${ENV_CARDS_URL}


Click Login With Role Selection Button On Home Page
    ${login_with_role_selection_btn_locator}=    Set Variable    BackdoorLogin
    Click Element    ${login_with_role_selection_btn_locator}


Open Role Selection On Home Page
    ${role_selection_locator}=    Set Variable    TestingBackdoorUsername
    Click Element    ${role_selection_locator}


Select Admin Role On Home Page
    ${admin_option_locator}=    Set Variable    superAdminLogin
    Click Element    ${admin_option_locator}


Select THM Student CAS Role On Home Page
    ${option_locator}=    Set Variable    eduLogin
    Click Element    ${option_locator}


Select THM Teacher Option Role On Home Page
    ${option_locator}=    Set Variable    proLogin
    Click Element    ${option_locator}
