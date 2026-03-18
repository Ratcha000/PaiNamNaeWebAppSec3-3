*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}            Chrome
${LOGIN_URL}          http://localhost:3001/login
${HOME_URL}           http://localhost:3001/
${USER_EMAIL}         user_test01@example.com
${USER_PASSWORD}      123456789

*** Test Cases ***
# ─────────────────────────────────────────
# PERMISSION / ROLE TESTS
# ─────────────────────────────────────────

TC01 Non-Admin Cannot Access Incident Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/incidents ไม่ได้ → redirect กลับ home
    Login As Non-Admin
    Go To    http://localhost:3001/admin/incidents
    Verify Redirected To Home    http://localhost:3001/admin/incidents
    Capture Page Screenshot    tc01_incidents_blocked.png

TC02 Non-Admin Cannot Access User Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/users ไม่ได้ → redirect กลับ home
    Go To    http://localhost:3001/admin/users
    Verify Redirected To Home    http://localhost:3001/admin/users
    Capture Page Screenshot    tc02_users_blocked.png

TC03 Non-Admin Cannot Access Vehicle Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/vehicles ไม่ได้ → redirect กลับ home
    Go To    http://localhost:3001/admin/vehicles
    Verify Redirected To Home    http://localhost:3001/admin/vehicles
    Capture Page Screenshot    tc03_vehicles_blocked.png

TC04 Non-Admin Cannot Access Booking Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/bookings ไม่ได้ → redirect กลับ home
    Go To    http://localhost:3001/admin/bookings
    Verify Redirected To Home    http://localhost:3001/admin/bookings
    Capture Page Screenshot    tc04_bookings_blocked.png

TC05 Non-Admin Cannot Access Driver Verification
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/drivers ไม่ได้ → redirect กลับ home
    [Tags]    bug-candidate
    Go To    http://localhost:3001/admin/drivers
    Verify Redirected To Home    http://localhost:3001/admin/drivers
    Capture Page Screenshot    tc05_drivers_blocked.png

TC06 Non-Admin Cannot Access Blacklist Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/blacklist ไม่ได้ → redirect กลับ home
    Go To    http://localhost:3001/admin/blacklist
    Verify Redirected To Home    http://localhost:3001/admin/blacklist
    Capture Page Screenshot    tc06_blacklist_blocked.png

TC07 Non-Admin Cannot Access Payment Management
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin/payments ไม่ได้ → redirect กลับ home
    [Tags]    bug-candidate
    Go To    http://localhost:3001/admin/payments
    Verify Redirected To Home    http://localhost:3001/admin/payments
    Capture Page Screenshot    tc07_payments_blocked.png

TC08 Non-Admin Cannot Access Admin Root
    [Documentation]    ทดสอบว่า user ทั่วไปเข้า /admin ไม่ได้ → redirect กลับ home
    [Tags]    bug-candidate
    Go To    http://localhost:3001/admin
    Verify Redirected To Home    http://localhost:3001/admin
    Capture Page Screenshot    tc08_admin_root_blocked.png

TC09 Non-Admin Can Access Own Home Page
    [Documentation]    ทดสอบว่า user ทั่วไปยังเข้าหน้าของตัวเองได้ปกติ
    Go To    ${HOME_URL}
    Sleep    2s
    ${url}=    Get Location
    Should Not Contain    ${url}    login
    Should Not Contain    ${url}    admin
    Capture Page Screenshot    tc09_user_home_accessible.png

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.5s
    Capture Page Screenshot    suite_start.png

Login As Non-Admin
    Go To    ${LOGIN_URL}
    Wait Until Element Is Visible    id=identifier    10s
    Clear Element Text    id=identifier
    Clear Element Text    id=password
    Input Text    id=identifier    ${USER_EMAIL}
    Input Text    id=password      ${USER_PASSWORD}
    Capture Page Screenshot    non_admin_login_filled.png
    Click Element    xpath=//button[@type="submit"]
    Sleep    2s
    ${url}=    Get Location
    Should Not Contain    ${url}    login
    Capture Page Screenshot    non_admin_logged_in.png

Verify Redirected To Home
    [Arguments]    ${attempted_url}
    Sleep    2s
    ${url}=    Get Location
    # PASS: redirected away from the admin page (to / or /login)
    # FAIL: still sitting on the admin URL — no protection, security bug
    Run Keyword If    '${url}' == '${attempted_url}'
    ...    Fail    SECURITY BUG: Non-admin can access ${attempted_url} — no redirect occurred
    Should Not Contain    ${url}    admin
    Log    Access correctly blocked. Redirected to: ${url}
