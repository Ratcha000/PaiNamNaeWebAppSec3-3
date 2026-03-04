*** Settings ***
Library    SeleniumLibrary
Resource   ../../variables/testdata.robot

*** Variables ***
${LOGIN_IDENTIFIER}      id=identifier
${LOGIN_PASSWORD}        id=password
${LOGIN_BUTTON}          xpath=//button[contains(text(),'เข้าสู่ระบบ')]

*** Keywords ***

Login With Credentials
    [Arguments]    ${username}    ${password}

    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s
    Input Text    ${LOGIN_IDENTIFIER}    ${username}

    Wait Until Element Is Visible    ${LOGIN_PASSWORD}    10s
    Input Text    ${LOGIN_PASSWORD}      ${password}

    Click Button  ${LOGIN_BUTTON}

Login As Admin
    Login With Credentials    ${ADMIN_USERNAME}    ${ADMIN_PASSWORD}

Login As Blacklisted User
    Login With Credentials    ${BLACKLIST_USER}    ${BLACKLIST_PASSWORD}
	
Login As Normal User
    Login With Credentials    ${NORMAL_USERNAME}    ${NORMAL_PASSWORD}