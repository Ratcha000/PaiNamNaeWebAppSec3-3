*** Settings ***
Library         SeleniumLibrary    timeout=15s
Resource        variables.resource

*** Keywords ***
Open Browser To Login Page
    [Documentation]    เปิด Browser และไปที่หน้า Login
    ${options}=    Evaluate    selenium.webdriver.ChromeOptions()    modules=selenium.webdriver
    Evaluate    $options.add_argument('--headless=new')
    Evaluate    $options.add_argument('--window-size=1920,1080')
    Evaluate    $options.add_argument('--disable-gpu')
    Evaluate    $options.add_argument('--no-sandbox')
    ${service}=    Evaluate    selenium.webdriver.chrome.service.Service(executable_path=r'c:/Users/Jitra/Pailway/chromedriver/win64-145.0.7632.117/chromedriver-win64/chromedriver.exe')    modules=selenium.webdriver.chrome.service
    Create Webdriver    Chrome    options=${options}    service=${service}
    Go To    ${LOGIN_URL}
    Set Selenium Speed    ${DELAY}
    Wait Until Element Is Visible    ${INPUT_IDENTIFIER}    timeout=${TIMEOUT}

Login As User
    [Documentation]    Login ด้วย username และ password ที่กำหนด
    [Arguments]    ${username}    ${password}
    Wait Until Element Is Visible    ${INPUT_IDENTIFIER}    timeout=${TIMEOUT}
    Clear Element Text    ${INPUT_IDENTIFIER}
    Input Text    ${INPUT_IDENTIFIER}    ${username}
    Clear Element Text    ${INPUT_PASSWORD}
    Input Text    ${INPUT_PASSWORD}    ${password}
    Click Button    ${BTN_LOGIN}
    # รอจนกว่าจะออกจากหน้า login (redirect ไปหน้า home)
    Wait Until Location Does Not Contain    /login    timeout=${TIMEOUT}

Login As Passenger
    [Documentation]    Login ในฐานะ Passenger
    Login As User    ${PASSENGER_USERNAME}    ${PASSENGER_PASSWORD}

Login As Driver
    [Documentation]    Login ในฐานะ Driver
    Login As User    ${DRIVER_USERNAME}    ${DRIVER_PASSWORD}

Navigate To Payment Passenger Page
    [Documentation]    ไปที่หน้าชำระเงินของ Passenger
    Go To    ${PAYMENT_PASSENGER_URL}
    Wait Until Page Contains Element    css=.min-h-screen    timeout=${TIMEOUT}
    # รอให้ loading spinner หายไป
    Wait Until Page Does Not Contain Element    ${LOADING_SPINNER}    timeout=${TIMEOUT}

Navigate To Payment Driver Page
    [Documentation]    ไปที่หน้าตรวจสอบการชำระเงินของ Driver
    Go To    ${PAYMENT_DRIVER_URL}
    Wait Until Page Contains Element    css=.min-h-screen    timeout=${TIMEOUT}
    # รอให้ loading spinner หายไป
    Wait Until Page Does Not Contain Element    ${LOADING_SPINNER}    timeout=${TIMEOUT}

Close Browser Safely
    [Documentation]    ปิด Browser อย่างปลอดภัย
    Close All Browsers

Take Screenshot On Failure
    [Documentation]    ถ่ายภาพหน้าจอเมื่อเกิดข้อผิดพลาด
    Capture Page Screenshot

Wait For Element And Click
    [Documentation]    รอจนกว่า element จะปรากฏแล้วจึงคลิก
    [Arguments]    ${locator}
    Wait Until Element Is Visible    ${locator}    timeout=${TIMEOUT}
    Scroll Element Into View    ${locator}
    Click Element    ${locator}

Wait For Element And Input
    [Documentation]    รอจนกว่า element จะปรากฏแล้วจึงกรอกข้อมูล
    [Arguments]    ${locator}    ${text}
    Wait Until Element Is Visible    ${locator}    timeout=${TIMEOUT}
    Clear Element Text    ${locator}
    Input Text    ${locator}    ${text}
