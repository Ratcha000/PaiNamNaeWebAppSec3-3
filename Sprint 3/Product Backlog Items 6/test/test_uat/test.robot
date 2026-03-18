*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:3001

*** Test Cases ***
Open Home Page
    Open Browser    ${URL}    chrome
    Wait Until Page Contains    อย่างมั่นใจ    10s
    Sleep    3s
    Close Browser