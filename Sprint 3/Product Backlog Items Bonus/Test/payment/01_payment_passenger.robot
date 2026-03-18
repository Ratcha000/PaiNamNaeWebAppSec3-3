*** Settings ***
Documentation     UAT Test - Payment Flow สำหรับ Passenger
...               ทดสอบการชำระเงินของ Passenger ในระบบ Pailway
Library           SeleniumLibrary    timeout=15s
Resource          ../resources/common.resource
Resource          ../resources/variables.resource

Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser Safely
Test Teardown     Run Keyword If Test Failed    Take Screenshot On Failure

*** Test Cases ***
# ============================================
# TC-PAY-001: Login สำเร็จในฐานะ Passenger
# ============================================
TC-PAY-001 Login As Passenger Successfully
    [Documentation]    ทดสอบ Login เข้าสู่ระบบในฐานะ Passenger
    [Tags]    payment    passenger    login    smoke
    Login As Passenger
    Wait Until Location Does Not Contain    /login    timeout=${TIMEOUT}
    Page Should Not Contain Element    ${LOGIN_ERROR_MSG}
    Capture Page Screenshot    passenger_01_login_success_หน้าแรกหลังล็อกอิน.png

# ============================================
# TC-PAY-002: ไปที่หน้า Payment Passenger
# ============================================
TC-PAY-002 Navigate To Passenger Payment Page
    [Documentation]    ทดสอบนำทางไปยังหน้าชำระเงินของ Passenger
    [Tags]    payment    passenger    navigation
    Navigate To Payment Passenger Page
    Wait Until Page Contains    รายการชำระเงิน    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_02_payment_page_หน้ารายการชำระเงิน.png

# ============================================
# TC-PAY-003: ดูรายการ Payment
# ============================================
TC-PAY-003 View Payment List
    [Documentation]    ทดสอบว่าระบบแสดงรายการ payment หรือข้อความว่างเปล่า
    [Tags]    payment    passenger    list
    Navigate To Payment Passenger Page
    ${has_payments}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${PAYMENT_CARD}    timeout=5s
    Run Keyword If    ${has_payments}
    ...    Log    พบรายการ Payment
    ...    ELSE
    ...    Wait Until Page Contains    ไม่มีรายการชำระเงิน    timeout=5s
    Capture Page Screenshot    passenger_03_payment_list_รายการชำระเงิน.png

# ============================================
# TC-PAY-004: กดปุ่ม "ชำระเงิน" เปิด Payment Modal
# ============================================
TC-PAY-004 Open Payment Modal
    [Documentation]    ทดสอบเปิด Payment Modal เมื่อกดปุ่ม "ชำระเงิน"
    [Tags]    payment    passenger    modal
    Navigate To Payment Passenger Page
    ${has_pay_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_PAY}    timeout=5s
    Run Keyword If    not ${has_pay_button}
    ...    Skip    ไม่มีรายการ payment ที่สถานะ pending ให้ทดสอบ
    Wait For Element And Click    ${BTN_PAY}
    Wait Until Page Contains Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    Wait Until Page Contains    เงินสด    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_04_payment_modal_opened_หน้าต่างเลือกวิธีชำระเงิน.png
    Wait For Element And Click    ${BTN_MODAL_CANCEL}
    Wait Until Page Does Not Contain Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}

# ============================================
# TC-PAY-005: เลือกชำระเงินด้วย "เงินสด"
# ============================================
TC-PAY-005 Select Cash Payment Method
    [Documentation]    ทดสอบเลือกวิธีชำระเงินด้วยเงินสดและยืนยัน
    [Tags]    payment    passenger    cash
    Navigate To Payment Passenger Page
    ${has_pay_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_PAY}    timeout=5s
    Run Keyword If    not ${has_pay_button}
    ...    Skip    ไม่มีรายการ payment ที่สถานะ pending ให้ทดสอบ
    Wait For Element And Click    ${BTN_PAY}
    Wait Until Page Contains Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    Wait For Element And Click    ${RADIO_CASH}
    Wait For Element And Click    ${BTN_MODAL_NEXT}
    Wait Until Page Contains    ชำระเงินสด    timeout=${TIMEOUT}
    Wait Until Page Contains Element    ${BTN_CONFIRM_CASH}    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_05_cash_confirm_modal_ยืนยันชำระเงินสด.png
    Wait For Element And Click    ${BTN_CONFIRM_CASH}
    Wait Until Page Does Not Contain Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    # ตรวจสอบว่ามีรายการที่เป็นสถานะ รอยืนยันเงินสด หรือมีปุ่ม ยกเลิก/รอการยืนยัน โผล่มาแทน
    Wait Until Page Contains    รายการชำระเงิน    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_06_cash_payment_submitted_ชำระเงินสดเรียบร้อย.png

# ============================================
# TC-PAY-006: เลือกชำระเงินด้วย "QR Code" (View Only)
# ============================================
TC-PAY-006 Select QR Code Payment Method
    [Documentation]    ทดสอบดูหน้าต่างชำระเงินด้วย QR Code (ข้ามถ้าไม่มีข้อมูล Driver QR)
    [Tags]    payment    passenger    qrcode
    Navigate To Payment Passenger Page
    ${has_pay_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_PAY}    timeout=5s
    Run Keyword If    not ${has_pay_button}
    ...    Skip    ไม่มีรายการ payment ที่สถานะ pending ให้ทดสอบ
    Wait For Element And Click    ${BTN_PAY}
    Wait Until Page Contains Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    
    # Check if PROMPTPAY exists
    ${has_promptpay}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${RADIO_PROMPTPAY}    timeout=2s
    Run Keyword If    not ${has_promptpay}
    ...    Run Keywords
    ...    Wait For Element And Click    ${BTN_MODAL_CANCEL}
    ...    AND Skip    คนขับไม่ได้ตั้งค่า QR Code ไว้
    
    Wait For Element And Click    ${RADIO_PROMPTPAY}
    Wait For Element And Click    ${BTN_MODAL_NEXT}
    Wait Until Page Contains    สแกน QR Code    timeout=${TIMEOUT}
    Wait Until Page Contains Element    ${BTN_ALREADY_PAID}    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_07_qr_code_modal_หน้าสแกนคิวอาร์โค้ด.png
    Wait For Element And Click    ${BTN_ALREADY_PAID}
    
    Wait Until Page Contains    อัปโหลดสลิป    timeout=${TIMEOUT}
    # ใช้รูปที่ capture มาก่อนหน้านี้เป็น slip จำลอง
    Choose File    ${INPUT_FILE_RECEIPT}    ${EXECDIR}/passenger_07_qr_code_modal_หน้าสแกนคิวอาร์โค้ด.png
    
    # Input Amount
    Input Text    xpath=//input[@type='number']    500
    
    # Click Upload
    Wait For Element And Click    xpath=//button[contains(text(), 'ยืนยันและอัปโหลด')]
    
    Wait Until Page Does Not Contain Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    Wait Until Page Contains    รายการชำระเงิน    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_08_qr_payment_submitted_ชำระคิวอาร์โค้ดเรียบร้อย.png

# ============================================
# TC-PAY-007: เลือกชำระเงินด้วย "โอนธนาคาร" (View Only)
# ============================================
TC-PAY-007 Select Bank Transfer Payment Method
    [Documentation]    ทดสอบดูหน้าต่างชำระเงินรูปโอนเข้าบัญชีธนาคาร (ข้ามถ้าไม่มีข้อมูล Bank Info)
    [Tags]    payment    passenger    transfer
    Navigate To Payment Passenger Page
    ${has_pay_button}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_PAY}    timeout=5s
    Run Keyword If    not ${has_pay_button}
    ...    Skip    ไม่มีรายการ payment ที่สถานะ pending ให้ทดสอบ
    Wait For Element And Click    ${BTN_PAY}
    Wait Until Page Contains Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    
    # Check if TRANSFER exists
    ${has_transfer}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${RADIO_TRANSFER}    timeout=2s
    Run Keyword If    not ${has_transfer}
    ...    Run Keywords
    ...    Wait For Element And Click    ${BTN_MODAL_CANCEL}
    ...    AND Skip    คนขับไม่ได้ตั้งค่าบัญชีธนาคารไว้
    
    Wait For Element And Click    ${RADIO_TRANSFER}
    Wait For Element And Click    ${BTN_MODAL_NEXT}
    Wait Until Page Contains    โอนเงินผ่านบัญชีธนาคาร    timeout=${TIMEOUT}
    Wait Until Page Contains Element    ${BTN_ALREADY_PAID}    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_09_bank_transfer_modal_หน้าโอนเงินธนาคาร.png
    
    Wait For Element And Click    ${BTN_ALREADY_PAID}
    
    Wait Until Page Contains    อัปโหลดสลิป    timeout=${TIMEOUT}
    # ใช้รูปที่ capture มาก่อนหน้านี้เป็น slip จำลอง
    Choose File    ${INPUT_FILE_RECEIPT}    ${EXECDIR}/passenger_09_bank_transfer_modal_หน้าโอนเงินธนาคาร.png
    
    # Input Amount
    Input Text    xpath=//input[@type='number']    500
    
    # Click Upload
    Wait For Element And Click    xpath=//button[contains(text(), 'ยืนยันและอัปโหลด')]
    
    Wait Until Page Does Not Contain Element    ${MODAL_CONTAINER}    timeout=${TIMEOUT}
    Wait Until Page Contains    รายการชำระเงิน    timeout=${TIMEOUT}
    Capture Page Screenshot    passenger_10_bank_transfer_submitted_โอนเงินธนาคารเรียบร้อย.png

# ============================================
# TC-PAY-008: ดูใบเสร็จรับเงินหลังชำระเงินเสร็จสิ้น
# ============================================
TC-PAY-008 View Receipt After Payment Completed
    [Documentation]    ทดสอบว่าหลังชำระเงินเรียบร้อยแล้ว สามารถกดปุ่ม "ใบเสร็จรับเงิน" เพื่อดูใบเสร็จได้
    [Tags]    payment    passenger    receipt
    Navigate To Payment Passenger Page
    
    # ตรวจสอบว่ามีรายการที่ชำระเรียบร้อยและมีปุ่มใบเสร็จรับเงิน
    ${has_receipt_btn}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_DOWNLOAD_RECEIPT}    timeout=5s
    Run Keyword If    not ${has_receipt_btn}
    ...    Fail    ไม่มีรายการที่ชำระเงินเรียบร้อยและมีปุ่มใบเสร็จรับเงินให้ทดสอบ
    
    # เซฟ Window Handles เดิม
    ${main_window}=    Get Window Handles
    
    # เลื่อนปุ่มให้อยู่ตรงกลางหน้าจอ แล้วใช้ JS click เพื่อข้าม overlay
    ${elem}=    Get WebElement    ${BTN_DOWNLOAD_RECEIPT}
    Execute Javascript    arguments[0].scrollIntoView({block: "center"});    ARGUMENTS    ${elem}
    Sleep    1s
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${elem}
    
    # รอจนกว่าหน้าต่างใหม่จะถูกเปิดขึ้น
    Wait Until Keyword Succeeds    10s    1s    Check New Window Opened    ${main_window}
    
    # สลับไปยังหน้าใบเสร็จ
    ${all_windows}=    Get Window Handles
    Switch Window      ${all_windows}[1]
    
    # ตรวจสอบเนื้อหาในหน้าใบเสร็จ
    Wait Until Page Contains    PaiNamNae Ride-Sharing    timeout=10s
    Capture Page Screenshot    passenger_11_receipt_full_ใบเสร็จรับเงิน.png
    
    # ปิดหน้าต่างใบเสร็จ
    Close Window
    
    # สลับกลับมาหน้าหลัก
    Switch Window      ${main_window}[0]

# ============================================
# TC-PAY-009: ดูใบกำกับภาษีแบบย่อหลังชำระเงินเสร็จสิ้น
# ============================================
TC-PAY-009 View Tax Invoice After Payment Completed
    [Documentation]    ทดสอบว่าหลังชำระเงินเรียบร้อยแล้ว สามารถกดปุ่ม "ใบกำกับภาษีแบบย่อ" เพื่อดูใบกำกับภาษีได้
    [Tags]    payment    passenger    tax_invoice
    Navigate To Payment Passenger Page
    
    # ตรวจสอบว่ามีรายการที่ชำระเรียบร้อยและมีปุ่มใบกำกับภาษีแบบย่อ
    ${has_tax_btn}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_DOWNLOAD_TAX_INVOICE}    timeout=5s
    Run Keyword If    not ${has_tax_btn}
    ...    Skip    ไม่มีรายการที่ชำระเงินเรียบร้อยและมีปุ่มใบกำกับภาษีให้ทดสอบ
    
    # เซฟ Window Handles เดิม
    ${main_window}=    Get Window Handles
    
    # เลื่อนปุ่มให้อยู่ตรงกลางหน้าจอ แล้วใช้ JS click เพื่อข้าม overlay
    ${elem}=    Get WebElement    ${BTN_DOWNLOAD_TAX_INVOICE}
    Execute Javascript    arguments[0].scrollIntoView({block: "center"});    ARGUMENTS    ${elem}
    Sleep    1s
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${elem}
    
    # รอจนกว่าหน้าต่างใหม่จะถูกเปิดขึ้น
    Wait Until Keyword Succeeds    10s    1s    Check New Window Opened    ${main_window}
    
    # สลับไปยังหน้าใบกำกับภาษี
    ${all_windows}=    Get Window Handles
    Switch Window      ${all_windows}[1]
    
    # ตรวจสอบเนื้อหาในหน้าใบกำกับภาษี
    Wait Until Page Contains    ใบกำกับภาษีอย่างย่อ    timeout=10s
    Wait Until Page Contains    บริษัท ไพนำแน จำกัด    timeout=10s
    Capture Page Screenshot    passenger_12_tax_invoice_ใบกำกับภาษีอย่างย่อ.png
    
    # ปิดหน้าต่าง
    Close Window
    
    # สลับกลับมาหน้าหลัก
    Switch Window      ${main_window}[0]

*** Keywords ***
Check New Window Opened
    [Arguments]    ${original_windows}
    ${current_windows}=    Get Window Handles
    ${orig_count}=    Get Length    ${original_windows}
    ${cur_count}=     Get Length    ${current_windows}
    Should Be True    ${cur_count} > ${orig_count}
