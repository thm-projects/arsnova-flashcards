*** Settings ***
Documentation    Cardsets E2E-Tests for ARSNova Cards. Includes creating an
...              'Task' and 'Learning Unit' Card set using an automated browser.

Resource    utility/testdata.robot
Resource    browser/browser.robot
Resource    webpages/homepage/homepage.robot
Resource    webpages/cardsets/cardset_page.robot
Resource    webpages/cardsets/create_cardset_overlay.robot
Resource    webpages/cardsets/cardsets_page.robot
Resource    webpages/navpar/navbar.robot

Suite Setup      Load TestDB
Test Setup       Custom Test Setup
Test Teardown    Custom Test Teardown

Force Tags    e2e    cardsets    browser


*** Variables ***
${learning_unit_cardset_label}    Muster-Lerneinheit-Label
${learning_unit_cardset_description}    Muster-Lerneinheit-Description
${task_cardset_label}    Muster-Aufgabenstellung-Label
${task_cardset_description}    Muster-Aufgabenstellung-Description

*** Test Cases ***
Create Learning Unit Cardset Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Cardsets Page Is Shown
    Close Cardset Page Overlay
    Click Create New Card Index On Personal Cardsets Page

    Create Cardset Overlay Page Is Shown
    Enter Card Set Label "${learning_unit_cardset_label}" On Create Card Set Overlay
    Open Card Set Type Dropdown On Create Card Set Overlay
    Select Card Set Type Learning Unit On Create Card Set Overlay
    Enter Card Set Description "${learning_unit_cardset_description}" On Create Card Set Overlay
    Click Save New Card Set On Create Card Set Overlay

    Cardset Page Of Cardset With Label "${learning_unit_cardset_label}" Is Shown


Create Task Cardset Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Cardsets Page Is Shown
    Close Cardset Page Overlay
    Click Create New Card Index On Personal Cardsets Page

    Create Cardset Overlay Page Is Shown
    Enter Card Set Label "${task_cardset_label}" On Create Card Set Overlay
    Open Card Set Type Dropdown On Create Card Set Overlay
    Select Card Set Type Task On Create Card Set Overlay
    Enter Card Set Description "${task_cardset_description}" On Create Card Set Overlay
    Click Save New Card Set On Create Card Set Overlay

    Cardset Page Of Cardset With Label "${task_cardset_label}" Is Shown


*** Keywords ***
Custom Test Setup
    Open Test Browser
    Go To Home Page


Custom Test Teardown
    Close Test Browser
    Restore TestDB
