*** Settings ***
Documentation    Utility Library for loading the test database

Library    Process


*** Keywords ***
Load TestDB
    ${result}=    Run Process    ${ENV_LOAD_TESTDB_PATH}
    Log To Console    Result Of Loading Testdb: ${result.stdout}
