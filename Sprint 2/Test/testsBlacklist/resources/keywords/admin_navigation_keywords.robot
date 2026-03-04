*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${SYSTEM_BUTTON}            xpath=//span[normalize-space()='System']
${DASHBOARD_MENU}           xpath=//a[@href='/admin/users']
${REPORT_MENU}              xpath=//a[contains(@href,'/admin/users/report')]
${BLACKLIST_MENU}           xpath=//a[contains(@href,'/admin/users/blacklist')]

*** Keywords ***

Open System Dropdown
    Wait Until Element Is Visible    ${SYSTEM_BUTTON}    10s
    Click Element    ${SYSTEM_BUTTON}
    Sleep    0.7s
    Wait Until Element Is Visible    ${DASHBOARD_MENU}    5s


Go To Dashboard
    Open System Dropdown
    Execute Javascript    document.querySelector("a[href='/admin/users']").click();
    Wait Until Location Contains     /admin/users    10s


Go To Report Management Via System Menu
    Open System Dropdown
    Execute Javascript    document.querySelector("a[href*='/admin/users/report']").click();
    Wait Until Location Contains    /admin/users/report    10s


Go To Blacklist Page Via System Menu
    Open System Dropdown
    Execute Javascript    document.querySelector("a[href*='/admin/users/blacklist']").click();
    Wait Until Location Contains    /admin/users/blacklist    10s