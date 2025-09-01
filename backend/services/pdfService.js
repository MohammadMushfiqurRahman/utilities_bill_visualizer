const pdfParse = require('pdf-parse');

const parsePdf = async (pdfBuffer) => {
  const data = await pdfParse(pdfBuffer);

  // --- PDF Parsing Logic (Generic Implementation) ---
  const text = data.text;

  // The following are examples of how you might extract data.
  // You will need to adjust the regular expressions based on the actual format of your PDF bills.

  const amountDueMatch = text.match(/Amount Due: \$([\d.]+)/);
  const amountDue = amountDueMatch ? parseFloat(amountDueMatch[1]) : null;

  const dueDateMatch = text.match(/Due Date: (\d{2}\/\d{2}\/\d{4})/);
  const dueDate = dueDateMatch ? dueDateMatch[1] : null;

  const usageMatch = text.match(/Usage: ([\d.]+) kWh/);
  const usage = usageMatch ? parseFloat(usageMatch[1]) : null;

  return {
    amountDue,
    dueDate,
    usage,
    rawText: text,
  };
};

module.exports = { parsePdf };
