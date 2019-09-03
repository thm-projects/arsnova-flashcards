*** Settings ***
Documentation    Library file for the corresponding create card page of ARSNova cards.
...              Does contain all test functionality the user can perform on the webpage.

Resource    browser/browser.robot


*** Keywords ***
Create Card Page Is Shown
    ${subject_topic_input_field_locator}=    Set Variable    subjectEditor
    Element Should Be Visible    ${subject_topic_input_field_locator}


Input Card Topic "${topic}" In Card Topic Input Field On Create Card Page
    ${subject_topic_input_field_locator}=    Set Variable    subjectEditor
    Input Text    ${subject_topic_input_field_locator}    ${topic}


Click Save New Card And Return Button On Create Card Page
    ${button_locator}=    Set Variable    cardSaveReturn
    Click Element    ${button_locator}
