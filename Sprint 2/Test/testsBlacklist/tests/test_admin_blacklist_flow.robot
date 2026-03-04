*** Settings ***
Library     SeleniumLibrary
Resource    ../variables/testdata.robot
Resource    ../resources/keywords/browser_keywords.robot
Resource    ../resources/keywords/login_keywords.robot
Resource    ../resources/keywords/report_keywords.robot

Suite Setup       Open Browser Clean
Suite Teardown    Close Browser Session


*** Test Cases ***

TC00 Login With Empty Fields Should Not Submit
    [Documentation]    Verify system does not allow login when fields are empty

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Click Button    ${LOGIN_BUTTON}

    Wait Until Location Contains    /login    10s
    Page Should Contain Element    ${LOGIN_IDENTIFIER}


TC01 Admin Login Successfully
    [Documentation]    Verify Admin can login successfully

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Admin

    Wait Until Location Is    ${BASE_URL}/    15s
    Location Should Be       ${BASE_URL}/


TC02 Navigate To Report Management
    [Documentation]    Verify Admin can navigate to Report page

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Admin
    Wait Until Location Is    ${BASE_URL}/    15s

    Go To    ${BASE_URL}/admin/users/report
    Wait Until Location Contains    /admin/users/report    10s
    Verify Report Page Loaded


TC03 Admin Can Blacklist User From Report
    [Documentation]    Verify Admin can change report status to Blacklist

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Admin
    Wait Until Location Is    ${BASE_URL}/    15s

    Go To    ${BASE_URL}/admin/users/report
    Wait Until Location Contains    /admin/users/report    10s

    Change First Report To Blacklist
    Verify Report Updated To Blacklist


TC04 Verify User Appears In Blacklist Page
    [Documentation]    Verify blacklisted user appears in blacklist page

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Admin
    Wait Until Location Is    ${BASE_URL}/    15s

    Go To    ${BASE_URL}/admin/users/blacklist
    Wait Until Location Contains    /admin/users/blacklist    10s
    Verify Blacklisted User Appears In List


TC05 Blacklisted User Cannot Login
    [Documentation]    Verify blacklisted user cannot login to system

    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Blacklisted User

    Wait Until Page Contains    บัญชีของคุณถูกระงับการใช้งาน    10s
	
TC06 Non-Blacklisted User Can Login Successfully
    Go To    ${BASE_URL}/login
    Wait Until Element Is Visible    ${LOGIN_IDENTIFIER}    10s

    Login As Normal User

    Wait Until Location Does Not Contain    /login    10s


TC07 Admin Cannot Access Report Page Without Login
    [Documentation]    Verify system protects report page from unauthenticated access

    Delete All Cookies
    Go To    ${BASE_URL}/admin/users/report

    Wait Until Location Contains    /login    10s
    Page Should Contain Element    ${LOGIN_IDENTIFIER}