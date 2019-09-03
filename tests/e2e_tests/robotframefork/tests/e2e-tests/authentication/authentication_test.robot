*** Settings ***
Documentation    Authentication E2E-Tests for ARSNova Cards. Includes Login- and
...              logout test.

Resource    browser/browser.robot
Resource    webpages/homepage/homepage.robot
Resource    webpages/cardsets/cardset_list_page.robot
Resource    webpages/navpar/navbar.robot
Resource    utility/testdata.robot

Test Setup       Custom Test Setup
Test Teardown    Custom Test Teardown

Force Tags    e2e    authentication    browser


*** Test Cases ***
Login As THM CAS Student Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page
    Cardset List Page Is Shown


Logout As THM CAS Student Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page

    Cardset List Page Is Shown

    Close Cardset List Page Overlay
    Click Logout Button On Navbar

    Home Page Is Shown


Login As THM Teacher Test
    Open Role Selection On Home Page
    Select THM Teacher Option Role On Home Page
    Click Login With Role Selection Button On Home Page
    Card Set List Page Is Shown


Logout As THM Teacher Test
    Open Role Selection On Home Page
    Select THM Teacher Option Role On Home Page
    Click Login With Role Selection Button On Home Page

    Cardset List Page Is Shown

    Close Cardset List Page Overlay
    Click Logout Button On Navbar

    Home Page Is Shown


Login As Administrator Test
    Open Role Selection On Home Page
    Select Admin Role On Home Page
    Click Login With Role Selection Button On Home Page
    Cardset List Page Is Shown


Logout As Administrator Test
    Open Role Selection On Home Page
    Select Admin Role On Home Page
    Click Login With Role Selection Button On Home Page

    Cardset List Page Is Shown

    Close Cardset List Page Overlay
    Click Logout Button On Navbar

    Home Page Is Shown


*** Keywords ***
Custom Test Setup
    Open Test Browser
    Go To Home Page


Custom Test Teardown
    Close Test Browser
    Load TestDB
