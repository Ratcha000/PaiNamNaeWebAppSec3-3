*** Settings ***
Documentation     UAT Test - Payment Receipt การเข้าดูและตรวจสอบเนื้อหาใบเสร็จของ Passenger
Library           SeleniumLibrary    timeout=15s
Resource          ../resources/common.resource
Resource          ../resources/variables.resource

Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser Safely
Test Teardown     Run Keyword If Test Failed    Take Screenshot On Failure

*** Test Cases ***
# ============================================
# TC-REC-001: ค้นหารายการที่อนุมัติแล้วและเปิดใบเสร็จ
# ============================================
TC-REC-001 Open Payment Receipt
    [Documentation]    ค้นหารายการชำระเงินที่ Status = 'ชำระเรียบร้อย' และกดปุ่ม 'ใบเสร็จรับเงิน' เพื่อเปิดหน้าต่างใหม่
    [Tags]    payment    passenger    receipt
    Login As Passenger
    Navigate To Payment Passenger Page
    Capture Page Screenshot    receipt_01_passenger_payment_page_หน้ารายการชำระเงิน.png
    
    # ดูว่ามีปุ่มดาวน์โหลดใบเสร็จหรือไม่
    ${has_receipt}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_DOWNLOAD_RECEIPT}    timeout=5s
    Run Keyword If    not ${has_receipt}
    ...    Skip    ไม่มีรายการที่ชำระเงินเรียบร้อยและมีใบเสร็จให้ทดสอบ
    
    # เซฟ ID หน้าต่างเดิม
    ${main_window}=    Get Window Handles
    
    # เลื่อนปุ่มให้อยู่ตรงกลางหน้าและใช้ JS ข้าม Overlay
    ${elem}=    Get WebElement    ${BTN_DOWNLOAD_RECEIPT}
    Execute Javascript    arguments[0].scrollIntoView({block: "center"});    ARGUMENTS    ${elem}
    Sleep    1s
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${elem}
    
    # รอจนกว่าหน้าต่างใหม่จะถูกเปิดขึ้น (จำนวน Handles เพิ่มขึ้น)
    Wait Until Keyword Succeeds    10s    1s    Check New Window Opened    ${main_window}
    
    # สลับไปยังหน้าใบเสร็จ
    ${all_windows}=    Get Window Handles
    Switch Window      ${all_windows}[1]
    
    # ตรวจสอบว่าในหน้าใหม่มีคำว่าใบเสร็จหรือ Passenger
    Wait Until Page Contains    PaiNamNae Ride-Sharing    timeout=10s
    Capture Page Screenshot    receipt_02_receipt_opened_หน้าใบเสร็จ.png
    
    # ปิดหน้าต่างใบเสร็จ
    Close Window
    
    # สลับกลับมาหน้าหลัก
    Switch Window      ${main_window}[0]


# ============================================
# TC-REC-002: ตรวจสอบข้อมูลในเอกสารใบเสร็จว่าครบตามที่ระบุ
# ============================================
TC-REC-002 Verify Receipt Content Details
    [Documentation]    ตรวจสอบว่าใบเสร็จที่เปิดขึ้นมีรายละเอียดของ Passenger, ยอดเงินรวม, และอื่นๆ ครบถ้วน
    [Tags]    payment    passenger    receipt
    Navigate To Payment Passenger Page
    
    # ดูว่ามีปุ่มดาวน์โหลดใบเสร็จหรือไม่
    ${has_receipt}=    Run Keyword And Return Status
    ...    Wait Until Page Contains Element    ${BTN_DOWNLOAD_RECEIPT}    timeout=5s
    Run Keyword If    not ${has_receipt}
    ...    Skip    ไม่มีรายการที่ชำระเงินเรียบร้อยและมีใบเสร็จให้ทดสอบ
    
    ${main_window}=    Get Window Handles
    ${elem}=    Get WebElement    ${BTN_DOWNLOAD_RECEIPT}
    Execute Javascript    arguments[0].scrollIntoView({block: "center"});    ARGUMENTS    ${elem}
    Sleep    1s
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${elem}
    Wait Until Keyword Succeeds    10s    1s    Check New Window Opened    ${main_window}
    
    ${all_windows}=    Get Window Handles
    Switch Window      ${all_windows}[1]
    
    # ตรวจสอบ Content ภายใน
    Wait Until Page Contains    เอกสารนี้ออกโดยระบบอัตโนมัติ / This receipt is system-generated    timeout=10s
    Wait Until Page Contains    ข้อมูลผู้โดยสาร / Passenger    timeout=5s
    Wait Until Page Contains    วันที่พิมพ์ / Printed:    timeout=5s
    Wait Until Page Contains    ยอดรวมที่ชำระ / Total Amount Paid    timeout=5s
    Capture Page Screenshot    receipt_03_receipt_content_verified_เนื้อหาใบเสร็จถูกต้อง.png
    
    Close Window
    Switch Window      ${main_window}[0]


*** Keywords ***
Check New Window Opened
    [Arguments]    ${original_windows}
    ${current_windows}=    Get Window Handles
    ${orig_count}=    Get Length    ${original_windows}
    ${cur_count}=     Get Length    ${current_windows}
    Should Be True    ${cur_count} > ${orig_count}
