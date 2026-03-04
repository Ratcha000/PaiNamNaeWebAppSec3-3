*** Settings ***
Library    SeleniumLibrary

*** Keywords ***

Open Browser Clean
    Open Browser    ${BASE_URL}/login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Timeout    10s

Close Browser Session
    Close Browser