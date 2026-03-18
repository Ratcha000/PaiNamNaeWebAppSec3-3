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
Admin Can Update Incident Status Successfully
    [Documentation]    ทดสอบ admin เปลี่ยน status incident
    Login To System
    Go To Incident Page
    Open Incident Detail
    Update Incident Status
    Verify Status Updated

*** Keywords ***

Open Browser To Login Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.5s
    Capture Page Screenshot    open_login.png

Login To System
    Wait Until Element Is Visible    id=identifier    10s

    Input Text    id=identifier    ${USERNAME}
    Input Text    id=password      ${PASSWORD}
    Capture Page Screenshot    login_filled.png

    Click Element    xpath=//button[@type="submit"]

    # รอ redirect
    Wait Until Location Contains    3001    10s
    Capture Page Screenshot    login_success.png


Go To Incident Page
    # เข้า admin incidents ตรง ๆ
    Go To    http://localhost:3001/admin/incidents

    Wait Until Page Contains    Incident Management    10s
    Capture Page Screenshot    incident_page.png


Open Incident Detail
    # กดปุ่ม View (ตัวแรก)
    Wait Until Element Is Visible    xpath=//button[contains(.,'View')]    10s
    Click Element    xpath=(//button[contains(.,'View')])[1]

    Wait Until Page Contains    Incident Detail    10s
    Capture Page Screenshot    incident_detail.png


*** Keywords ***
Update Incident Status
    Wait Until Element Is Visible    xpath=//select    10s
    Select From List By Label        xpath=//select    RESOLVED
    Capture Page Screenshot          status_selected.png
    Click Element                    xpath=//button[contains(.,'Update Status')]

    # ✅ Handle the alert FIRST — no screenshots, no DOM touches before this
    ${alert_text}=    Handle Alert    accept    timeout=5s

    # ✅ Now it's safe to log and screenshot
    Log    Alert text is: ${alert_text}
    Should Contain    ${alert_text}    Status updated successfully
    Capture Page Screenshot    alert_handled.png

Verify Status Updated
    Wait Until Page Contains    RESOLVED    10s
    Capture Page Screenshot    status_updated.png