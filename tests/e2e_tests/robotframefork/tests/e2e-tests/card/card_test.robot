*** Settings ***
Documentation    Cards E2E-Tests for ARSNova Cards. Includes creating a card in a cardset.

Resource    utility/testdata.robot
Resource    browser/browser.robot
Resource    webpages/homepage/homepage.robot
Resource    webpages/card/create_card_page.robot
Resource    webpages/cardsets/cardset_page.robot
Resource    webpages/cardsets/cardset_list_page.robot
Resource    webpages/card_preview/cards_preview_page.robot
Resource    webpages/navpar/navbar.robot

Test Setup       Custom Test Setup
Test Teardown    Custom Test Teardown
Force Tags       e2e    card    browser


*** Variables ***
${created_card_topic}    Musterthema


*** Test Cases ***
Show Cards Preview Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Card Set List Page Is Shown
    Close Cardset List Page Overlay
    ${first_card_set_label}=    Get First Cardset Label In Card Set List On Card Set List Page
    Click First Card Set On Card Set List Page

    Cardset Page Of Cardset With Label "${first_card_set_label}" Is Shown

    Click Cards Preview Button On Cardset Page
    Cards Preview Page Is Shown


Create Card Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Card Set List Page Is Shown
    Close Cardset List Page Overlay
    ${first_card_set_label}=    Get First Cardset Label In Card Set List On Card Set List Page
    Click First Card Set On Card Set List Page

    Cardset Page Of Cardset With Label "${first_card_set_label}" Is Shown
    Click Create New Card On Cardset Page

    Create Card Page Is Shown
    Input Card Topic "${created_card_topic}" In Card Topic Input Field On Create Card Page
    Click Save New Card And Return Button On Create Card Page

    Cardset Page Of Cardset With Label "${first_card_set_label}" Is Shown


*** Keywords ***
Custom Test Setup
    Open Test Browser
    Go To Home Page


Custom Test Teardown
    Close Test Browser
    Load TestDB
