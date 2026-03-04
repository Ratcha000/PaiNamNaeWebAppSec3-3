*** Variables ***

${REPORT_MENU_URL}       ${BASE_URL}/admin/users/report
${BLACKLIST_MENU_URL}    ${BASE_URL}/admin/users/blacklist

${FIRST_SEVERITY_DROPDOWN}    xpath=(//select)[1]
${SAVE_BUTTON_FIRST}          xpath=(//button[contains(text(),'บันทึก')])[1]

${BLACKLIST_LABEL}       xpath=//*[contains(text(),'Blacklist')]
${REPORT_PAGE_HEADER}    xpath=//*[contains(text(),'Report Management')]