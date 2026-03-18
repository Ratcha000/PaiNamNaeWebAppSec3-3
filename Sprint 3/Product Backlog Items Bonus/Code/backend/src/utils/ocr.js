const Tesseract = require('tesseract.js');

async function performOCR(imagePath) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, 'tha', {
      logger: (m) => console.log('OCR:', m),
    });

    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('ไม่สามารถอ่านข้อความจากรูปได้');
  }
}

module.exports = {
  performOCR,
};