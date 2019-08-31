*** Settings ***
Documentation    Library file for the corresponding cardsets page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cardsets Page Of Student Is Shown
    [Documentation]    Validates that the Homepage is shown in the browser.
    ...                Will throw an error otherwise.

    Location Should Contain    /cardsets
    Element Should Be Visible    //*[@id="useCasesModal"]/div/div/div[2]/table/tbody/tr[1]/td/div/div/button[1]
