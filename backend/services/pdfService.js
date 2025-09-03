const pdfParse = require('pdf-parse');

const patterns = {
  amountDue: [/Amount Due: \$([\d.]+)/, /Total Amount: \$([\d.]+)/],
  dueDate: [/Due Date: (\d{2}\/\d{2}\/\d{4})/, /Payment Due: (\d{2}\/\d{2}\/\d{4})/],
  usage: [/Usage: ([\d.]+) kWh/, /Total Usage: ([\d.]+) kWh/],
};

const parsePdf = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    console.log('Parsed text:', text);

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
    console.log('Extracted data:', extractedData);
    return {
      ...extractedData,
      rawText: text,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};

module.exports = { parsePdf };
