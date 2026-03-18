*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}              http://localhost:3001
${TEST IMAGE}       D:\3_2\ProjectSE\nitiphum88\Test\Test_language\test.png

${USERNAME}         testuser007
${PASSWORD}         12345678
${EMAIL}            testuser007@mail.com
${FIRSTNAME}        Sompong
${LASTNAME}         Somwang
${PHONE}            0999999999
${DELETE_REASON}    ไม่ต้องการใช้งานแอปแล้ว


*** Test Cases ***
Register And Delete Account

    # ====== ปิด Password Manager + Notification ======
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver

    Call Method    ${options}    add_argument    --disable-notifications
    Call Method    ${options}    add_argument    --incognito

    ${prefs}=    Create Dictionary
    ...    credentials_enable_service=False
    ...    profile.password_manager_enabled=False

    Call Method    ${options}    add_experimental_option    prefs    ${prefs}

    Open Browser    ${URL}    browser=chrome    options=${options}
    Maximize Browser Window
    Set Selenium Speed    0.5s

    # ====== 1 REGISTER ======
    Go To    ${URL}/register

    Wait Until Element Is Visible    id=username
    Input Text    id=username          ${USERNAME}
    Input Text    id=email             ${EMAIL}
    Input Text    id=password          ${PASSWORD}
    Input Text    id=confirmPassword   ${PASSWORD}
    Click Button    ถัดไป

    # ====== 2  ======
    Wait Until Element Is Visible    id=firstName
    Input Text    id=firstName      ${FIRSTNAME}
    Input Text    id=lastName       ${LASTNAME}
    Input Text    id=phoneNumber    ${PHONE}
    Click Element    css=input[name="gender"][value="male"]
    Click Button    ถัดไป

    # ====== 3  ======
        Wait Until Page Contains Element    id=idCardFile    timeout=10s
    Execute JavaScript    document.getElementById("idCardFile").style.display="block";
    Choose File    id=idCardFile    ${TEST IMAGE}
    Sleep    1s

    Wait Until Page Contains Element    id=selfieFile    timeout=10s
    Execute JavaScript    document.getElementById("selfieFile").style.display="block";
    Choose File    id=selfieFile    ${TEST IMAGE}
    Sleep    1s

    Input Text    id=idNumber       1234567890123
    Input Text    id=expiryDate     01012030

    Click Element    css=input[type="checkbox"]
    Click Button    สมัครสมาชิก


    # ====== 4 Popup Login ======
    Wait Until Page Contains    สมัครสมาชิกเรียบร้อยแล้ว!
    Click Button    ไปสู่หน้าเข้าสู่ระบบ
    Wait Until Location Contains    login    timeout=10s

    # ====== 5 LOGIN ======
    Wait Until Element Is Visible    id=identifier
    Input Text    id=identifier    ${EMAIL}
    Input Text    id=password      ${PASSWORD}
    Click Button    เข้าสู่ระบบ
    Wait Until Location Is    ${URL}/    timeout=10s

    # ====== 6 PROFILE ======
    Go To    ${URL}/profile
    Wait Until Page Contains    โปรไฟล์

    # ====== 7 DELETE ACCOUNT ======
    Click Button    ลบบัญชี
    Sleep    1s

    Input Text    xpath=//textarea    ${DELETE_REASON}
    Input Text    xpath=//input[@placeholder="กรอกรหัสผ่าน"]    ${PASSWORD}

    Wait Until Element Is Enabled    xpath=//div[contains(@class,"fixed")]//button[@type="submit"]
    Click Element    xpath=//div[contains(@class,"fixed")]//button[@type="submit"]

    Wait Until Page Contains    บัญชีของคุณจะถูกลบในอีก 90 วัน    timeout=10s

    Sleep    5s
    Close Browser
