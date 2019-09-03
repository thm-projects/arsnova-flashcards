*** Settings ***
Documentation    Cards E2E-Tests for ARSNova Cards. Includes creating a card in a cardset.

Resource    utility/testdata.robot
Resource    browser/browser.robot
Resource    webpages/homepage/homepage.robot
Resource    webpages/cardsets/cardset_page.robot
Resource    webpages/cardsets/create_cardset_overlay.robot
Resource    webpages/cardsets/cardset_list_page.robot
Resource    webpages/navpar/navbar.robot

Test Setup       Custom Test Setup
Test Teardown    Custom Test Teardown
Force Tags       e2e    card    browser


*** Variables ***
${learning_unit_cardset_label}    Muster-Lerneinheit-Label
${learning_unit_cardset_description}    Muster-Lerneinheit-Description
${task_cardset_label}    Muster-Aufgabenstellung-Label
${task_cardset_description}    Muster-Aufgabenstellung-Description

*** Test Cases ***
Create Card Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Card Set List Page Is Shown
    Close Cardset Page Overlay


*** Keywords ***
Custom Test Setup
    Open Test Browser
    Go To Home Page


Custom Test Teardown
    Close Test Browser
    Load TestDB
