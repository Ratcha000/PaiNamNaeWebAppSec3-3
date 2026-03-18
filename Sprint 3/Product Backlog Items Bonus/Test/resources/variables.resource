*** Variables ***
# ==========================================
#  Application URLs
# ==========================================
${BASE_URL}                 http://localhost:3001
${LOGIN_URL}                ${BASE_URL}/login
${PAYMENT_PASSENGER_URL}    ${BASE_URL}/payment/passenger
${PAYMENT_DRIVER_URL}       ${BASE_URL}/payment/driver

# ==========================================
#  Test User Credentials
# ==========================================
${DRIVER_USERNAME}          testro1
${DRIVER_PASSWORD}          Ing123456789

${PASSENGER_USERNAME}       testro2
${PASSENGER_PASSWORD}       Ing123456789

# ==========================================
#  Browser Settings
# ==========================================
${BROWSER}                  Chrome
${DELAY}                    0.3s
${TIMEOUT}                  15s

# ==========================================
#  Login Page Locators
# ==========================================
${INPUT_IDENTIFIER}         id=identifier
${INPUT_PASSWORD}           id=password
${BTN_LOGIN}                css=button[type="submit"]
${LOGIN_ERROR_MSG}          css=div[style*="color: red"]

# ==========================================
#  Payment Passenger Page Locators
# ==========================================
${PAYMENT_LIST}             css=.space-y-6
${PAYMENT_CARD}             css=.space-y-6 > div
${PAYMENT_AMOUNT}           css=.text-2xl.font-bold
${STATUS_BADGE}             css=.rounded-full
${BTN_PAY}                  xpath=//button[contains(text(), 'ชำระเงิน')]
${BTN_VIEW_RECEIPT}         xpath=//button[contains(text(), 'ดูสลิป')]
${BTN_DOWNLOAD_RECEIPT}     xpath=//button[contains(text(), 'ใบเสร็จรับเงิน')]
${BTN_DOWNLOAD_TAX_INVOICE}    xpath=//button[contains(text(), 'ใบกำกับภาษีแบบย่อ')]
${BTN_RESUBMIT}             xpath=//button[contains(text(), 'ส่งใหม่')]
${LOADING_SPINNER}          css=.animate-spin
${NO_DATA_MSG}              xpath=//h3[contains(text(), 'ไม่มีรายการชำระเงิน')]
${ERROR_MSG}                css=.bg-red-50

# ==========================================
#  Payment Modal Locators
# ==========================================
${MODAL_CONTAINER}          css=.fixed.inset-0.z-50.bg-black
${RADIO_CASH}               xpath=//input[@type='radio' and @value='cash']
${RADIO_PROMPTPAY}          xpath=//input[@type='radio' and @value='promptpay']
${RADIO_TRANSFER}           xpath=//input[@type='radio' and @value='transfer']
${BTN_MODAL_NEXT}           xpath=//button[contains(text(), 'ดำเนินการต่อ')]
${BTN_MODAL_CANCEL}         xpath=//button[contains(text(), 'ยกเลิก')]
${BTN_CONFIRM_CASH}         xpath=//button[contains(text(), 'ยืนยันจ่ายเงินสดแล้ว')]
${BTN_ALREADY_PAID}         xpath=//button[contains(text(), 'ฉันชำระเงินแล้ว')]
${BTN_GO_BACK}              xpath=//button[contains(text(), 'ย้อนกลับ')]
${INPUT_FILE_RECEIPT}       css=input[type='file']
${BTN_UPLOAD_RECEIPT}       xpath=//button[contains(text(), 'ส่งสลิป')]
${RECEIPT_ERROR_MSG}        xpath=//p[contains(text(), 'กรุณาอัปโหลดสลิป')]

# ==========================================
#  Driver Payment Page Locators
# ==========================================
${DRIVER_PAYMENT_CARD}      css=.grid > div
${DRIVER_EMPTY_STATE}       xpath=//p[contains(text(), 'ไม่มีรายการที่รอตรวจสอบ')]
${BTN_APPROVE}              xpath=//button[contains(text(), 'ยืนยันการชำระ')]
${BTN_REJECT}               xpath=//button[contains(text(), 'ปฏิเสธการชำระ')]
${VERIFICATION_MODAL}       css=.fixed.inset-0.z-50.bg-black
${VERIFICATION_NOTE}        css=textarea
${BTN_CONFIRM_VERIFY}       xpath=//div[contains(@class, 'fixed')]//button[contains(text(), 'ยืนยัน')]
${BTN_CONFIRM_REJECT}       xpath=//div[contains(@class, 'fixed')]//button[contains(text(), 'ปฏิเสธ')]
${BTN_CANCEL_MODAL}         xpath=//div[contains(@class, 'fixed')]//button[contains(text(), 'ยกเลิก')]
