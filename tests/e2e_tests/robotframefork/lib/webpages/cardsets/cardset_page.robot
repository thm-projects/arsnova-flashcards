*** Settings ***
Documentation    Library file for the corresponding INDIVIDUAL cardset page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardset Page Of Cardset With Label "${label}" Is Shown
    ${card_set_label_locator}=      Set Variable    cardsetTitle
    Element Should Be Visible       ${card_set_label_locator}

    Wait Until Element Contains     ${card_set_label_locator}    ${label}
    ${actual_label}=    Get Text    ${card_set_label_locator}
    Should Be Equal As Strings      ${label}    ${actual_label}


Click Create New Card On Cardset Page
    ${create_new_card_locator}=    Set Variable    newCardBtn
    Click Element    ${create_new_card_locator}


Click Cards Preview Button On Cardset Page
    ${prev_button_locator}=    Set Variable    //*[@id="cardsetInfoDetail"]/div/div[2]/div[1]/button[1]
    Click Element    ${prev_button_locator}
