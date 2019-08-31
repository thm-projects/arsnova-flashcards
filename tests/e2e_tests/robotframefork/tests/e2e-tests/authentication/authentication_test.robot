*** Settings ***
Documentation    Authentication E2E-Tests for ARSNova Cards. Includes Login- and
...              logout test.

Resource    browser/browser.robot
Resource    webpages/homepage/homepage.robot
Resource    webpages/cardsets/cardsets_student_page.robot

Test Setup       Custom Test Setup
Test Teardown    Close Test Browser

Force Tags    e2e    authentication    browser


*** Test Cases ***
Login As THM CAS Student Test
    Open Role Selection On Home Page
    Select THM Student CAS Role On Home Page
    Click Login With Role Selection Button On Home Page
    Cardsets Page Of Student Is Shown


*** Keywords ***
Custom Test Setup
    Open Test Browser
    Go To Home Page
