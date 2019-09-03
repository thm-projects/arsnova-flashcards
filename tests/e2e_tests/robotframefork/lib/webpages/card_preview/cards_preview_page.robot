*** Settings ***
Documentation    Library file for the corresponding card preview page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Cards Preview Page Is Shown
    ${flashcard_side_left_locator}=    Set Variable    flashcardSidebarLeft
    Element Should Be Visible    ${flashcard_side_left_locator}
