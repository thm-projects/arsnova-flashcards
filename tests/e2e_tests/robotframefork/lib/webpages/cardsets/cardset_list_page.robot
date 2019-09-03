*** Settings ***
Documentation    Library file for the corresponding cardsets list page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardset List Page Is Shown
    [Documentation]    Validates that the card set list page is shown in the browser.
    ...                Will throw an error otherwise.

    Location Should Contain    /cardsets
    Element Should Be Visible    //*[@id="useCasesModal"]/div/div/div[2]/table/tbody/tr[1]/td/div/div/button[1]


Close Cardset List Page Overlay
    [Documentation]    Closes the overlay mostly shown after login on the cardsets page

    Click Element    //*[@id="useCasesModal"]/div/div/div[1]/a


Click Create New Card Set On Cardset List Page
    [Documentation]    Clicks the green button 'Kartei anlegen' on the personal cardsets page.

    ${button_locator}=    Set Variable    newCardSet
    Click Element    ${button_locator}


Click First Card Set On Card Set List Page
    ${first_locator}=    Set Variable    cardsetLink0
    Click Element    ${first_locator}
