*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}                http://localhost:3001/login
${PASSENGER_EMAIL}    passenger1@Gmail.com
${DRIVER_EMAIL}       driver1@gmail.com
${PASSWORD}           Test0000

*** Test Cases ***
Full Booking And Payment Flow
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Set Selenium Timeout    20s

# =========================================================
# ================= PASSENGER FLOW ========================
# =========================================================

    Wait Until Element Is Visible    xpath=//input[@placeholder='กรอกชื่อผู้ใช้หรืออีเมล']
    Input Text    xpath=//input[@placeholder='กรอกชื่อผู้ใช้หรืออีเมล']    ${PASSENGER_EMAIL}
    Input Text    xpath=//input[@placeholder='กรอกรหัสผ่าน']    ${PASSWORD}
    Click Element    xpath=//button[contains(.,'เข้าสู่ระบบ')]
    Sleep    5s

    # ค้นหาเส้นทาง
    Click Element    xpath=//a[contains(.,'ค้นหาเส้นทาง')]
    Wait Until Location Contains    findTrip
	Sleep    7s

    # เลือก driver test
    Click Element    xpath=//div[contains(.,'driver test')]
    Sleep    1s

    # กดจองที่นั่ง
    Click Element    xpath=//button[contains(.,'จองที่นั่ง')]

    # จุดขึ้นรถ
    Wait Until Element Is Visible    xpath=(//input[@placeholder='พิมพ์ชื่อสถานที่...'])[1]
    Input Text    xpath=(//input[@placeholder='พิมพ์ชื่อสถานที่...'])[1]    Khon Kaen
    Click Element    xpath=(//div[contains(@class,'pac-item')])[1]
	Sleep    3s

    # จุดลงรถ
    Input Text    xpath=(//input[@placeholder='พิมพ์ชื่อสถานที่...'])[2]    Cambodia
    Click Element    xpath=(//div[contains(@class,'pac-item')])[1]
	Sleep    3s

    # ยืนยันการจอง
    Click Element    xpath=//button[contains(.,'ยืนยันการจอง')]
    Sleep    2s

    # Logout Passenger
    Click Element    xpath=//div[contains(@class,'dropdown-trigger')]
    Click Element    xpath=//button[contains(.,'Logout')]
    Wait Until Element Is Visible    xpath=//button[contains(.,'เข้าสู่ระบบ')]

# =========================================================
# ================= DRIVER CONFIRM BOOKING ================
# =========================================================

    Input Text    xpath=//input[@placeholder='กรอกชื่อผู้ใช้หรืออีเมล']    ${DRIVER_EMAIL}
    Input Text    xpath=//input[@placeholder='กรอกรหัสผ่าน']    ${PASSWORD}
    Click Element    xpath=//button[contains(.,'เข้าสู่ระบบ')]
    Sleep    2s

    Click Element    xpath=//div[contains(@class,'dropdown-trigger')]
    Click Element    xpath=//a[contains(.,'คำขอจองเส้นทางของฉัน')]
    Wait Until Location Contains    myRoute

    Click Element    xpath=(//button[contains(.,'ยืนยันคำขอ')])[1]
    Wait Until Element Is Visible    xpath=//button[contains(.,'ยืนยันคำขอ')]
    Click Element    xpath=//button[contains(.,'ยืนยันคำขอ')]
    Sleep    2s

    # Logout Driver
    Click Element    xpath=//div[contains(@class,'dropdown-trigger')]
    Click Element    xpath=//button[contains(.,'Logout')]
    Wait Until Element Is Visible    xpath=//button[contains(.,'เข้าสู่ระบบ')]

# =========================================================
# ================= PASSENGER PAYMENT =====================
# =========================================================

    Input Text    xpath=//input[@placeholder='กรอกชื่อผู้ใช้หรืออีเมล']    ${PASSENGER_EMAIL}
    Input Text    xpath=//input[@placeholder='กรอกรหัสผ่าน']    ${PASSWORD}
    Click Element    xpath=//button[contains(.,'เข้าสู่ระบบ')]
    Sleep    2s

    Click Element    xpath=//a[contains(.,'การเดินทางของฉัน')]
    Click Element    xpath=//button[contains(.,'ยืนยันแล้ว')]
    Click Element    xpath=(//button[contains(.,'ชำระเงิน')])[1]
    Wait Until Location Contains    payment

# ================= เลือกวิธีชำระ =================

    # ===== เงินสด =====
    Click Element    xpath=//label[contains(.,'เงินสด')]
    Click Element    xpath=//button[contains(.,'ดำเนินการต่อ')]
    Wait Until Element Is Visible    xpath=//button[contains(.,'ยืนยันจ่ายเงินสดแล้ว')]
    Click Element    xpath=//button[contains(.,'ยืนยันจ่ายเงินสดแล้ว')]

    # ===== ถ้าจะทดสอบ QR ให้ใช้แทนเงินสด =====
    # Click Element    xpath=//label[contains(.,'QR Code')]
    # Click Element    xpath=//button[contains(.,'ดำเนินการต่อ')]
    # Wait Until Element Is Visible    xpath=//button[contains(.,'ยืนยันการชำระ')]
    # Click Element    xpath=//button[contains(.,'ยืนยันการชำระ')]

    # ===== ถ้าจะทดสอบโอนธนาคาร =====
    # Click Element    xpath=//label[contains(.,'โอนเงินผ่านธนาคาร')]
    # Click Element    xpath=//button[contains(.,'ดำเนินการต่อ')]
    # Wait Until Element Is Visible    xpath=//button[contains(.,'ยืนยันการชำระ')]
    # Click Element    xpath=//button[contains(.,'ยืนยันการชำระ')]

    Sleep    2s

    # Logout Passenger
    Click Element    xpath=//div[contains(@class,'dropdown-trigger')]
    Click Element    xpath=//button[contains(.,'Logout')]
    Wait Until Element Is Visible    xpath=//button[contains(.,'เข้าสู่ระบบ')]

# =========================================================
# ================= DRIVER CONFIRM PAYMENT ================
# =========================================================

    Input Text    xpath=//input[@placeholder='กรอกชื่อผู้ใช้หรืออีเมล']    ${DRIVER_EMAIL}
    Input Text    xpath=//input[@placeholder='กรอกรหัสผ่าน']    ${PASSWORD}
    Click Element    xpath=//button[contains(.,'เข้าสู่ระบบ')]
    Sleep    2s

    Click Element    xpath=//div[contains(@class,'dropdown-trigger')]
    Click Element    xpath=//a[contains(.,'การเดินทางทั้งหมด')]
    Wait Until Location Contains    myRoute

    Click Element    xpath=(//button[contains(.,'ตรวจสอบการชำระ')])[1]
    Wait Until Element Is Visible    xpath=(//button[contains(.,'ยืนยันการชำระ')])[1]
    Click Element    xpath=(//button[contains(.,'ยืนยันการชำระ')])[1]

    Sleep    2s
    Close Browser