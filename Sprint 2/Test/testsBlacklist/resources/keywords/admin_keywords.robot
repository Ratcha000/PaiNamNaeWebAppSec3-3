*** Settings ***
Library    SeleniumLibrary
Resource   ../../variables/testdata.robot

*** Variables ***
${SYSTEM_MENU}            xpath=//button[contains(.,'System')]
${DASHBOARD_MENU}         xpath=//a[contains(text(),'Dashboard')]
${REPORT_MENU_SIDEBAR}    xpath=//a[contains(text(),'Report Management')]

*** Keywords ***

Go To Admin Dashboard Via System Menu
    Wait Until Element Is Visible    ${SYSTEM_MENU}    15s
    Click Element    ${SYSTEM_MENU}

    Wait Until Element Is Visible    ${DASHBOARD_MENU}    10s
    Click Element    ${DASHBOARD_MENU}

    Wait Until Location Contains    /admin/users    15s


Go To Report Management Via Sidebar
    Wait Until Element Is Visible    ${REPORT_MENU_SIDEBAR}    15s
    Click Element    ${REPORT_MENU_SIDEBAR}

    Wait Until Location Contains    /admin/users/report    15s

Go To Blacklist Page Via System Menu
    Click Element    xpath=//span[text()='System']
    Click Element    xpath=//a[contains(@href,'/admin/users/blacklist')]
    Wait Until Location Contains    /admin/users/blacklist    10s

Go To Report Management Via System Menu
    Click Element    xpath=//span[text()='System']
    Click Element    xpath=//a[contains(@href,'/admin/users/report')]
    Wait Until Location Contains    /admin/users/report    10s


Go To Blacklist Page Via System Menu
    Click Element    xpath=//span[text()='System']
    Click Element    xpath=//a[contains(@href,'/admin/users/blacklist')]
    Wait Until Location Contains    /admin/users/blacklist    10s