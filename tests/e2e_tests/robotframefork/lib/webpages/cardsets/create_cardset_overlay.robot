*** Settings ***
Documentation    Library file for the corresponding cardsets overlay of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardsets Page Is Shown
    [Documentation]    Validates that the Create Card Set Overlay is shown in the browser.
    ...                Will throw an error otherwise.

    Element Should Be Visible    setCardsetFormModalTitle


Enter Card Set Label "${label}" On Create Card Set Overlay
    ${label_locator}=    Set Variable    setName
    Input Text           ${label_locator}    ${label}


Enter Card Set Description "${description}" On Create Card Set Overlay
    ${description_box_locator}=    Set Variable    contentEditor
    Input Text    ${description_box_locator}    ${description}


Click Save New Card Set On Create Card Set Overlay
    ${save_btn_locator}=    Set Variable    cardSetSave
    Click Element    ${save_btn_locator}


Open Card Set Type Dropdown On Create Card Set Overlay
    ${dropdown_locator}=    Set Variable    //*[@id="setCardsetFormModal"]/div/div/div[2]/div/div[1]/div[2]/div/button[1]
    Click Element    ${dropdown_locator}


Select Card Set Type Course Unit On Create Card Set Overlay
    ${selector}=    Set Variable    //*[@id="setCardsetFormModal"]/div/div/div[2]/div/div[1]/div[2]/div/ul/li[1]
    Click Element    ${selector}


Select Card Set Type Task On Create Card Set Overlay
    ${selector}=    Set Variable    //*[@id="setCardsetFormModal"]/div/div/div[2]/div/div[1]/div[2]/div/ul/li[2]
    Click Element    ${selector}
