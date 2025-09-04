const { PDFExtract } = require('pdf.js-extract');
const patterns = require('./patterns');

const parsePdf = async (pdfBuffer) => {
  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extractBuffer(pdfBuffer, {});
  const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');

  const extractedData = {};

  for (const field in patterns) {
    for (const pattern of patterns[field]) {
      const match = text.match(pattern);
      if (match) {
        extractedData[field] = parseFloat(match[1]) || match[1];
        break;
      }
    }
  }

  return {
    ...extractedData,
    rawText: text,
  };
};

module.exports = { parsePdf };
