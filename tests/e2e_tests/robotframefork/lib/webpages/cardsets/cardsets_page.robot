*** Settings ***
Documentation    Library file for the corresponding cardsets page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardsets Page Is Shown
    [Documentation]    Validates that the Homepage is shown in the browser.
    ...                Will throw an error otherwise.

    Location Should Contain    /cardsets
    Element Should Be Visible    //*[@id="useCasesModal"]/div/div/div[2]/table/tbody/tr[1]/td/div/div/button[1]


Personal Cardsets Page Is Shown
    [Documentation]    Validates that the personal cardsets page is shown (where users can create new cardsets from)
    Location Should Contain    /personal/cardsets


Public Cardsets Page Is Shown
    [Documentation]    Validates that the public cardsets page is shown

    Location Should Contain    /public/cardsets


Close Cardset Page Overlay
    [Documentation]    Closes the overlay mostly shown after login on the cardsets page

    Click Element    //*[@id="useCasesModal"]/div/div/div[1]/a


Click Create New Card Index On Personal Cardsets Page
    [Documentation]    Clicks the green button 'Kartei anlegen' on the personal cardsets page.

    ${button_locator}=    Set Variable    newCardSet
    Click Element    ${button_locator}
