*** Settings ***
Documentation    Library file for the corresponding INDIVIDUAL cardset page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardset Page Of Cardset With Label "${label}" Is Shown
    ${card_set_label_locator}=    Set Variable    cardsetTitle
    ${actual_label}=    Get Text    ${card_set_label_locator}
    Should Be Equal As Strings    ${label}    ${actual_label}
