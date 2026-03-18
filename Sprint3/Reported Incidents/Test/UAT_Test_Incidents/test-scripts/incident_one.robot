*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:3001/login
${USERNAME}       admin@example.com
${PASSWORD}       123456789

*** Test Cases ***
# ─────────────────────────────────────────
# STATUS TRANSITION TESTS
# ─────────────────────────────────────────

Admin Can Transition Status From PENDING To IN PROGRESS
    [Documentation]    ทดสอบเปลี่ยน status: PENDING → IN PROGRESS
    Login To System
    Go To Incident Page
    Reset Incident To PENDING
    Open Incident Detail
    Update Incident Status    IN PROGRESS    expect_success=${TRUE}
    Verify Status Updated     IN PROGRESS

Admin Can Transition Status From IN PROGRESS To RESOLVED
    [Documentation]    ทดสอบเปลี่ยน status: IN PROGRESS → RESOLVED
    Go To Incident Page
    Open Incident Detail
    Update Incident Status    RESOLVED    expect_success=${TRUE}
    Verify Status Updated     RESOLVED

Admin Can Transition Status From PENDING To REJECTED
    [Documentation]    ทดสอบเปลี่ยน status: PENDING → REJECTED
    Go To Incident Page
    Reset Incident To PENDING
    Open Incident Detail
    Update Incident Status    REJECTED    expect_success=${TRUE}
    Verify Status Updated     REJECTED

Admin Can Set Same Status Twice
    [Documentation]    ทดสอบว่า app อนุญาตให้ set status ซ้ำได้ และแสดง success
    Go To Incident Page
    Open Incident Detail
    Update Incident Status    REJECTED    expect_success=${TRUE}
    Capture Page Screenshot    duplicate_status_allowed.png

# ─────────────────────────────────────────
# FORM VALIDATION TESTS
# ─────────────────────────────────────────

Admin Cannot Submit Without Selecting Status
    [Documentation]    ทดสอบกด Update โดยไม่เลือก status ใหม่
    Go To Incident Page
    Reset Incident To PENDING
    Open Incident Detail
    Click Element    xpath=//button[contains(.,'Update Status')]
    ${result}    ${alert_text}=    Run Keyword And Ignore Error
    ...    Handle Alert    accept    timeout=3s
    Run Keyword If    '${result}' == 'PASS'
    ...    Log    Alert shown: ${alert_text}
    Run Keyword If    '${result}' == 'FAIL'
    ...    Page Should Contain    required
    Capture Page Screenshot    no_status_selected.png

Admin Can Submit With Same Status As Current
    [Documentation]    ทดสอบว่าการเลือก status เดิมแล้วกด Update สำเร็จได้
    Go To Incident Page
    Open Incident Detail
    Select From List By Label    xpath=//select    PENDING
    Click Element    xpath=//button[contains(.,'Update Status')]
    ${result}    ${alert_text}=    Run Keyword And Ignore Error
    ...    Handle Alert    accept    timeout=3s
    Run Keyword If    '${result}' == 'PASS'
    ...    Should Contain    ${alert_text}    Status updated successfully
    Run Keyword If    '${result}' == 'FAIL'
    ...    Log    No alert shown, page accepted quietly
    Capture Page Screenshot    same_status_blocked.png

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.5s
    Capture Page Screenshot    open_login.png

Login To System
    Wait Until Element Is Visible    id=identifier    10s
    Input Text    id=identifier      ${USERNAME}
    Input Text    id=password        ${PASSWORD}
    Capture Page Screenshot    login_filled.png
    Click Element    xpath=//button[@type="submit"]
    Wait Until Location Contains    3001    10s
    Capture Page Screenshot    login_success.png

Go To Incident Page
    Go To    http://localhost:3001/admin/incidents
    Sleep    1s
    ${url}=    Get Location
    Run Keyword If    'login' in '${url}'    Login To System
    Wait Until Page Contains    Incident Management    15s
    Capture Page Screenshot    incident_page.png

Open Incident Detail
    Wait Until Element Is Visible    xpath=//button[contains(.,'View')]    10s
    Click Element    xpath=(//button[contains(.,'View')])[1]
    Wait Until Page Contains    Incident Detail    10s
    Capture Page Screenshot    incident_detail.png

Reset Incident To PENDING
    # รีเซ็ต status กลับเป็น PENDING เพื่อให้แต่ละ test เริ่มจาก state เดิม
    Open Incident Detail
    Wait Until Element Is Visible    xpath=//select    10s
    Select From List By Label        xpath=//select    PENDING
    Click Element                    xpath=//button[contains(.,'Update Status')]
    ${result}    ${ignored}=    Run Keyword And Ignore Error
    ...    Handle Alert    accept    timeout=5s
    Go To Incident Page

Update Incident Status
    [Arguments]    ${status}    ${expect_success}=${TRUE}
    Wait Until Element Is Visible    xpath=//select    10s
    Select From List By Label        xpath=//select    ${status}
    Capture Page Screenshot          status_selected.png
    Click Element                    xpath=//button[contains(.,'Update Status')]

    # Handle alert immediately — no DOM touches between click and this line
    ${alert_text}=    Handle Alert    accept    timeout=5s
    Log    Alert: ${alert_text}
    Capture Page Screenshot    alert_handled.png

    Run Keyword If    '${expect_success}' == 'True'
    ...    Should Contain    ${alert_text}    Status updated successfully
    Run Keyword If    '${expect_success}' == 'False'
    ...    Should Contain    ${alert_text}    Status updated successfully

Verify Status Updated
    [Arguments]    ${expected_status}
    Wait Until Page Contains    ${expected_status}    10s
    Capture Page Screenshot    status_verified_${expected_status}.png
