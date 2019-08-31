*** Settings ***
Documentation    Utility Library for deleting and loading the test database

Library    Process


*** Keywords ***
Delete TestDB
    ${result}=    Run Process    ${ENV_DUMP_TESTDB_PATH}
    Log To Console    Result Of Loading Testdb: ${result.stdout}

Load TestDB
    ${result}=    Run Process    ${ENV_LOAD_TESTDB_PATH}
    Log To Console    Result Of Loading Testdb: ${result.stdout}

Restore TestDB
    Delete TestDB
    Load TestDB
