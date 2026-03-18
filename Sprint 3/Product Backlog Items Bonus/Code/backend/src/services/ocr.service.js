const Tesseract = require('tesseract.js');

// แปลงชื่อเดือนภาษาไทย → เลข 2 หลัก
const THAI_MONTHS = {
  'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
  'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
  'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
};

/**
 * ทำความสะอาด reference number จาก OCR noise
 * - แปลงเลขไทย ๐-๙ → 0-9
 * - แปลงตัวอักษรไทยที่ OCR มักอ่านผิดใน hex context
 * - ลบ characters ที่ไม่ใช่ alphanumeric
 */
function cleanReference(str) {
  return str
    .replace(/[๐-๙]/g, ch => String(ch.charCodeAt(0) - 0x0E50))  // ๑→1, ๙→9
    .replace(/ส/g, 's')
    .replace(/เ/g, 'e')
    .replace(/ฉ/g, 'c')
    .replace(/ด/g, 'd')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function parseSlipText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let amount = null, fee = null, date = null, time = null, referenceNumber = null;

  for (const line of lines) {

    // ── จำนวนเงิน ──
    if (!amount && (line.includes('จํานวนเงิน') || line.includes('จำนวนเงิน'))) {
      const m = line.match(/([\d,]+\.\d{2})\s*(?:บาท|฿)?/);
      if (m) amount = parseFloat(m[1].replace(/,/g, ''));
    }

    // ── ค่าธรรมเนียม ──
    if (fee === null && line.includes('ธรรมเนียม')) {
      const m = line.match(/([\d,]+\.\d{2})\s*(?:บาท|฿)?/);
      if (m) fee = parseFloat(m[1].replace(/,/g, ''));
    }

    // ── วันที่ทำรายการ ──  รูปแบบ: "03 มี.ค. 2569 - 22:59"
    if (!date && (line.includes('วันที่') || line.includes('รายการ'))) {
      const dateMatch = line.match(/(\d{1,2})\s+([\u0E00-\u0E7F.]{3,6})\s+(\d{4})/);
      const timeMatch = line.match(/(\d{2}):(\d{2})/);
      if (dateMatch) {
        const day    = dateMatch[1].padStart(2, '0');
        const yearBE = parseInt(dateMatch[3], 10);
        const yearCE = yearBE > 2500 ? yearBE - 543 : yearBE;  // พ.ศ. → ค.ศ.
        const mon    = THAI_MONTHS[dateMatch[2]] || '01';
        try { date = new Date(`${yearCE}-${mon}-${day}`).toISOString(); } catch (_) {}
      }
      if (timeMatch) time = `${timeMatch[1]}:${timeMatch[2]}`;
    }

    // ── รหัสอ้างอิง ──
    if (!referenceNumber && line.includes('รหัสอ้างอิง')) {
      // ตัด label ออก แล้วเอา token แรก (ก่อน space = ตัวรหัส)
      const afterLabel = line.replace(/.*รหัสอ้างอิง\s*/u, '').trim();
      const firstToken = afterLabel.split(/\s+/)[0];  // ตัดขยะท้าย เช่น "โดร" ออก
      if (firstToken && firstToken.length >= 8) {
        const cleaned = cleanReference(firstToken);
        if (cleaned.length >= 10) referenceNumber = cleaned;
      }
    }
  }

  return { amount, fee, date: date || new Date().toISOString(), time, referenceNumber, rawText, ocrFailed: false, error: null };
}

const extractSlipData = async (imageBuffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'tha+eng', {
      logger: m => m.status === 'recognizing text' && console.log(`OCR: ${(m.progress*100).toFixed(0)}%`)
    });
    return parseSlipText(text);
  } catch (error) {
    return { amount: null, fee: null, date: new Date().toISOString(), time: null, referenceNumber: null, rawText: '', ocrFailed: true, error: error.message };
  }
};

module.exports = { extractSlipData };