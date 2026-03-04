*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${FIRST_SEVERITY_DROPDOWN}    xpath=(//select)[1]
${SAVE_BUTTON_FIRST}          xpath=(//button[contains(text(),'บันทึก')])[1]

*** Keywords ***

Verify Report Page Loaded
    Wait Until Page Contains    Report Management    10s


Change First Report To Blacklist
    Wait Until Element Is Visible    xpath=(//table//select)[1]    10s
    Select From List By Label        xpath=(//table//select)[1]    Blacklist
	Click Element    xpath=(//table//tr)[2]//button[contains(text(),'บันทึก')]
    Sleep    2s


Verify Report Updated To Blacklist
    Wait Until Element Is Visible    xpath=(//table//select)[1]    5s
    ${value}=    Get Selected List Label    xpath=(//table//select)[1]
    Should Be Equal    ${value}    Blacklist


Verify Blacklisted User Appears In List
    Wait Until Page Contains Element    xpath=//table    10s
    Page Should Contain    Blacklist

