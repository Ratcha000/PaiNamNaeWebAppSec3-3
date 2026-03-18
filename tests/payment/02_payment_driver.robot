*** Settings ***
Documentation     UAT Test - Payment Verification สำหรับ Driver
...               ทดสอบการตรวจสอบและยืนยัน/ปฏิเสธการชำระเงินของ Driver ในระบบ Pailway
Library           SeleniumLibrary    timeout=15s
Resource          ../resources/common.resource
Resource          ../resources/variables.resource

Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser Safely
Test Teardown     Run Keyword If Test Failed    Take Screenshot On Failure

*** Test Cases ***
# ============================================
# TC-DRV-001: Login สำเร็จในฐานะ Driver
# ============================================
TC-DRV-001 Login As Driver Successfully
    [Documentation]    ทดสอบ Login เข้าสู่ระบบในฐานะ Driver
    [Tags]    payment    driver    login    smoke
    Login As Driver
    Wait Until Location Does Not Contain    /login    timeout=${TIMEOUT}
    Page Should Not Contain Element    ${LOGIN_ERROR_MSG}
    Capture Page Screenshot    driver_01_login_success_หน้าแรกคนขับ.png

# ============================================
# TC-DRV-002: ไปที่หน้า Payment Verification
# ============================================
TC-DRV-002 Navigate To Driver Payment Page
    [Documentation]    ทดสอบนำทางไปยังหน้าตรวจสอบการชำระเงินของ Driver
    [Tags]    payment    driver    navigation
    Navigate To Payment Driver Page
    Wait Until Page Contains    ตรวจสอบการชำระเงิน    timeout=${TIMEOUT}
    Capture Page Screenshot    driver_02_payment_page_หน้ารายการตรวจสอบ.png

# ============================================
# TC-DRV-003: ดูรายการ Pending Payments
# ============================================
TC-DRV-003 View Pending Payments List
    [Documentation]    ทดสอบว่าระบบแสดงรายการ payment ที่รอตรวจสอบ
    [Tags]    payment    driver    list
    Navigate To Payment Driver Page
    ${has_payments}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${DRIVER_PAYMENT_CARD}    timeout=5s
    Run Keyword If    ${has_payments}
    ...    Log    พบรายการ Payment ที่รอตรวจสอบ
    ...    ELSE
    ...    Wait Until Page Contains    ไม่มีรายการที่รอตรวจสอบ    timeout=5s
    Capture Page Screenshot    driver_03_pending_payments_list_รายการรอตรวจสอบ.png

# ============================================
# TC-DRV-004: เปิด Approve Modal
# ============================================
TC-DRV-004 Open Approve Modal
    [Documentation]    ทดสอบเปิด Modal ยืนยันการชำระเงิน
    [Tags]    payment    driver    approve    modal
    Navigate To Payment Driver Page
    ${has_approve_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_APPROVE}    timeout=5s
    Run Keyword If    not ${has_approve_button}
    ...    Skip    ไม่มีรายการ payment ที่รอตรวจสอบ
    Wait For Element And Click    ${BTN_APPROVE}
    Wait Until Page Contains Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}
    Wait Until Page Contains    ยืนยันการชำระเงิน    timeout=${TIMEOUT}
    Wait Until Page Contains Element    ${VERIFICATION_NOTE}    timeout=${TIMEOUT}
    Capture Page Screenshot    driver_04_approve_modal_opened_หน้าต่างยืนยัน.png
    Wait For Element And Click    ${BTN_CANCEL_MODAL}
    Wait Until Page Does Not Contain Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}

# ============================================
# TC-DRV-005: เปิด Reject Modal
# ============================================
TC-DRV-005 Open Reject Modal
    [Documentation]    ทดสอบเปิด Modal ปฏิเสธการชำระเงิน
    [Tags]    payment    driver    reject    modal
    Navigate To Payment Driver Page
    ${has_reject_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_REJECT}    timeout=5s
    Run Keyword If    not ${has_reject_button}
    ...    Skip    ไม่มีรายการ payment ที่รอตรวจสอบ
    Wait For Element And Click    ${BTN_REJECT}
    Wait Until Page Contains Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}
    Wait Until Page Contains    ปฏิเสธการชำระเงิน    timeout=${TIMEOUT}
    Wait Until Page Contains Element    ${VERIFICATION_NOTE}    timeout=${TIMEOUT}
    Capture Page Screenshot    driver_05_reject_modal_opened_หน้าต่างปฏิเสธ.png
    Wait For Element And Click    ${BTN_CANCEL_MODAL}
    Wait Until Page Does Not Contain Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}

# ============================================
# TC-DRV-006: Approve Payment พร้อมหมายเหตุ
# ============================================
TC-DRV-006 Approve Payment With Note
    [Documentation]    ทดสอบยืนยันการชำระเงินพร้อมใส่หมายเหตุ
    [Tags]    payment    driver    approve    action
    Navigate To Payment Driver Page
    ${has_approve_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_APPROVE}    timeout=5s
    Run Keyword If    not ${has_approve_button}
    ...    Skip    ไม่มีรายการ payment ที่รอตรวจสอบ
    Wait For Element And Click    ${BTN_APPROVE}
    Wait Until Page Contains Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}
    Wait For Element And Input    ${VERIFICATION_NOTE}    UAT Test: ยืนยันการชำระเงินเรียบร้อย
    Capture Page Screenshot    driver_06_approve_with_note_กรอกหมายเหตุยืนยัน.png
    Wait For Element And Click    ${BTN_CONFIRM_VERIFY}
    ${alert_present}=    Run Keyword And Return Status
    ...    Alert Should Be Present    timeout=10s
    Sleep    2s
    Navigate To Payment Driver Page
    Capture Page Screenshot    driver_07_after_approve_หน้ารายการหลังยืนยัน.png

# ============================================
# TC-DRV-007: Reject Payment พร้อมเหตุผล
# ============================================
TC-DRV-007 Reject Payment With Reason
    [Documentation]    ทดสอบปฏิเสธการชำระเงินพร้อมเหตุผล (ข้ามถ้าไม่มีปุ่มให้กดแล้ว)
    [Tags]    payment    driver    reject    action
    Navigate To Payment Driver Page
    ${has_reject_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_REJECT}    timeout=5s
    Run Keyword If    not ${has_reject_button}
    ...    Skip    ไม่มีรายการ payment ที่รอตรวจสอบให้ Reject
    Wait For Element And Click    ${BTN_REJECT}
    Wait Until Page Contains Element    ${VERIFICATION_MODAL}    timeout=${TIMEOUT}
    Wait For Element And Input    ${VERIFICATION_NOTE}    UAT Test: สลิปไม่ชัด กรุณาส่งใหม่
    Capture Page Screenshot    driver_08_reject_with_reason_กรอกเหตุผลปฏิเสธ.png
    Wait For Element And Click    ${BTN_CONFIRM_REJECT}
    ${alert_present}=    Run Keyword And Return Status
    ...    Alert Should Be Present    timeout=10s
    Sleep    2s
    Navigate To Payment Driver Page
    Capture Page Screenshot    driver_09_after_reject_หน้ารายการหลังปฏิเสธ.png
