*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}          Chrome
${BASE_URL}         http://localhost:3001
${LOGIN_URL}        http://localhost:3001/login
${VALID_EMAIL}      admin@example.com
${VALID_PASSWORD}   123456789
${WRONG_PASSWORD}   wrongpassword
${WRONG_EMAIL}      notanemail
${FAKE_EMAIL}       nouser@nowhere.com

*** Test Cases ***
# ─────────────────────────────────────────
# LOGIN TEST CASES
# ─────────────────────────────────────────

TC01 Valid Credentials Login Successfully
    [Documentation]    ทดสอบ login ด้วย email และ password ที่ถูกต้อง
    Go To Login Page
    Input Credentials    ${VALID_EMAIL}    ${VALID_PASSWORD}
    Click Login Button
    Wait Until Location Contains    3001    10s
    ${url}=    Get Location
    Should Not Contain    ${url}    login
    Capture Page Screenshot    tc01_login_success.png

TC02 Wrong Password Shows Error
    [Documentation]    ทดสอบ login ด้วย password ผิด ต้องแสดง error
    Go To Login Page
    Input Credentials    ${VALID_EMAIL}    ${WRONG_PASSWORD}
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc02_wrong_password.png

TC03 Wrong Email Format Shows Error
    [Documentation]    ทดสอบ login ด้วย email format ผิด เช่น ไม่มี @
    Go To Login Page
    Input Credentials    ${WRONG_EMAIL}    ${VALID_PASSWORD}
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc03_wrong_email_format.png

TC04 Non-Existent Account Shows Error
    [Documentation]    ทดสอบ login ด้วย email ที่ไม่มีในระบบ
    Go To Login Page
    Input Credentials    ${FAKE_EMAIL}    ${VALID_PASSWORD}
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc04_nonexistent_account.png

TC05 Empty Fields Show Validation Error
    [Documentation]    ทดสอบกด login โดยไม่กรอกข้อมูลใดเลย
    Go To Login Page
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc05_empty_fields.png

TC06 Empty Password Only Shows Validation Error
    [Documentation]    ทดสอบกรอก email แต่ไม่กรอก password
    Go To Login Page
    Input Credentials    ${VALID_EMAIL}    ${EMPTY}
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc06_empty_password.png

TC07 Empty Email Only Shows Validation Error
    [Documentation]    ทดสอบกรอก password แต่ไม่กรอก email
    Go To Login Page
    Input Credentials    ${EMPTY}    ${VALID_PASSWORD}
    Click Login Button
    Verify Login Failed
    Capture Page Screenshot    tc07_empty_email.png

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.5s
    Capture Page Screenshot    suite_start.png

Go To Login Page
    Go To    ${LOGIN_URL}
    Wait Until Element Is Visible    id=identifier    10s
    Capture Page Screenshot    login_page_loaded.png

Input Credentials
    [Arguments]    ${email}    ${password}
    Clear Element Text    id=identifier
    Clear Element Text    id=password
    Run Keyword If    '${email}' != '${EMPTY}'
    ...    Input Text    id=identifier    ${email}
    Run Keyword If    '${password}' != '${EMPTY}'
    ...    Input Text    id=password      ${password}

Click Login Button
    Click Element    xpath=//button[@type="submit"]
    Sleep    2s

Verify Login Failed
    # Handle alert-style error first
    ${alert_result}    ${alert_text}=    Run Keyword And Ignore Error
    ...    Handle Alert    accept    timeout=3s
    Run Keyword If    '${alert_result}' == 'PASS'
    ...    Log    Alert error: ${alert_text}

    # If no alert, check we are still on login page (not redirected)
    ${url}=    Get Location
    Should Contain    ${url}    login

    # Optionally check for inline error text on page
    ${page_result}    ${ignored}=    Run Keyword And Ignore Error
    ...    Page Should Contain Element
    ...    xpath=//*[contains(@class,'error') or contains(@class,'invalid') or contains(@class,'alert')]
    Run Keyword If    '${page_result}' == 'PASS'
    ...    Log    Inline error element found on page
    Capture Page Screenshot    login_failed_verified.png
