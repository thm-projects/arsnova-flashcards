*** Settings ***
Documentation    Browser automation library for automating a browser
Library          SeleniumLibrary
Library          BuiltIn


*** Keywords ***
Open Test Browser
    [Documentation]    Opens and automates an headless instance of the google chrome
    ...                browser. By default the browser navigates to
    ...                https://google.de upon starting. After opening the test
    ...                browser, the browser can be interacted with using
    ...                selenium.

    ${default_startup_url}    Set Variable    https://google.de
    Run Keyword If    '${ENV_USE_GUI_BROWSER}' == 'True'    Open GUI Browser    ${default_startup_url}
    ...    ELSE       Open Headless Browser    ${default_startup_url}

    Set Selenium Settings
    Go To                            ${default_startup_url}


Open Headless Browser
    [Arguments]                      ${default_startup_url}
    [Documentation]    Opens and automates an headless instance of the Google
    ...                Chrome web browser.

    ${options}=                      Evaluate                sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method                      ${options}              add_argument       headless
    Call Method                      ${options}              add_argument       disable-gpu
    Call Method                      ${options}              add_argument       no-sandbox
    Call Method                      ${options}              add_argument       disable-dev-shm-usage
    Create WebDriver                 Chrome                  chrome_options=${options}
    Set Window Size                  1920                    1080


Open GUI Browser
    [Arguments]                      ${default_startup_url}
    [Documentation]    (In Library Helper Keyword, not meant to be used outside
    ...                of browser.robot library file)
    ...                Opens and automates an gui instance of the Google
    ...                Chrome web browser.

    Open Browser               ${default_startup_url}    Chrome
    Maximize Browser Window


Set Selenium Settings
    [Documentation]    Sets the selenium settings for the web browser automation.

    # Try actions for 30 seconds before throwing an exception
    Set Selenium Implicit Wait    30


Close Test Browser
    Close Browser


Location Should Be
    [Arguments]    ${url}
    Wait Until Keyword Succeeds    ${ENV_BROWSER_TIMEOUT} sec
    ...                            1 sec
    ...                            SeleniumLibrary.Location Should Be
    ...                            ${url}


Element Should Be Visible
    [Arguments]    ${locator}
    Wait Until Keyword Succeeds    ${ENV_BROWSER_TIMEOUT} sec
    ...                            1 sec
    ...                            SeleniumLibrary.Element Should Be Visible
    ...                            ${locator}


Go To
    [Arguments]    ${url}
    SeleniumLibrary.Go To    ${url}


Click Element
    [Arguments]    ${locator}

    Wait Until Keyword Succeeds    ${ENV_BROWSER_TIMEOUT} sec
    ...                            1 sec
    ...                            SeleniumLibrary.Click Element
    ...                            ${locator}
