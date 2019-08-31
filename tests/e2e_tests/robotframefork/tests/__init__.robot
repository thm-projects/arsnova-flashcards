*** Settings ***
Suite Setup    Custom Suite Setup


*** Keywords ***
Custom Suite Setup



Check Environment Variables
    Variable Should Exist    ${ENV_USE_GUI_BROWSER}    ERROR: You forgot to specify ENV_USE_GUI_BROWSER in the environment variables, Please pass using -v var:value in the command line
