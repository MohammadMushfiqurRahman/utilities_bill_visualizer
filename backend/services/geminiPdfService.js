
const https = require('https');

const billSchema = {
  type: "OBJECT",
  properties: {
    vendorName: {
      type: "STRING",
      description: "The name of the utility provider (e.g., 'PG&E', 'City Water', 'Recology').",
    },
    apartment: {
      type: "STRING",
      description:
        "The apartment, unit number, or service address if present (e.g., 'Apt 101', 'Unit B', '123 Main St'). If not present, use the account holder's name or another unique identifier.",
    },
    billDate: {
      type: "STRING",
      description: 'The date the bill was issued in YYYY-MM-DD format.',
    },
    dueDate: {
      type: "STRING",
      description: 'The date the payment is due in YYYY-MM-DD format.',
    },
    totalAmount: {
      type: "NUMBER",
      description: 'The total amount due on the bill.',
    },
    usage: {
      type: "OBJECT",
      properties: {
        value: {
          type: "NUMBER",
          description:
            'The numerical value of the primary consumption (e.g., 545.0, 7.5). If no usage is listed (e.g. for garbage), this can be 0.',
        },
        unit: {
          type: "STRING",
          description:
            "The unit of consumption (e.g., 'kWh', 'Gallons', 'Therms'). If no unit, provide a descriptor like 'Service'.",
        },
      },
      required: ['value', 'unit'],
    },
    accountNumber: {
      type: "STRING",
      description: "The customer's account number, often labeled 'Account Number' or similar.",
    },
    breakdown: {
      type: "ARRAY",
      description:
        "A list of line items from the bill, including their description and amount. For example, 'Previous Balance', 'Electric Charges', 'Taxes'. If not present, return an empty array.",
      items: {
        type: "OBJECT",
        properties: {
          description: {
            type: "STRING",
            description: 'The description of the charge or line item.',
          },
          amount: {
            type: "NUMBER",
            description: 'The amount for the line item.',
          },
        },
        required: ['description', 'amount'],
      },
    },
  },
  required: [
    'vendorName',
    'apartment',
    'billDate',
    'dueDate',
    'totalAmount',
    'usage',
    'accountNumber',
  ],
};

const billListSchema = {
  type: "ARRAY",
  items: billSchema,
};

async function extractBillDataFromPdfWithGemini(pdfBase64) {
  return new Promise((resolve, reject) => {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return reject(new Error('Gemini API key not configured on the server.'));
    }

    const pdfPart = {
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64,
      },
    };

    const textPart = {
      text: "This PDF may contain one or more utility bills, potentially for different apartments or service addresses. For each distinct bill found, extract the utility bill information. Provide details like vendor name, apartment/unit number or service address, bill date, due date, total amount, consumption usage, and account number. Also, extract a detailed breakdown of charges or line items, including the description and amount for each. If no breakdown is available, provide an empty array for the breakdown. Return the result as a JSON array of objects. Ensure dates are in YYYY-MM-DD format. If a bill is for something like garbage collection, usage value can be 0 and unit can be 'Service'.",
    };

    const requestBody = JSON.stringify({
      contents: { parts: [pdfPart, textPart] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: billListSchema,
      },
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-1.5-flash:generateContent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let body = '';
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      proxyRes.on('end', () => {
        try {
          if (proxyRes.statusCode >= 400) {
            const errorData = JSON.parse(body);
            return reject(new Error(errorData.error.message || 'An unknown error occurred.'));
          }

          const data = JSON.parse(body);
          const jsonText = data.candidates[0].content.parts[0].text.trim();
          let parsedData;
          try {
            parsedData = JSON.parse(jsonText);
          } catch (e) {
            console.error('Failed to parse JSON response from AI:', jsonText);
            return reject(new Error('Could not extract data from the PDF. The AI model returned a malformed response.'));
          }

          const billsArray = Array.isArray(parsedData) ? parsedData : [parsedData];

          if (billsArray.length === 0 || (billsArray.length === 1 && Object.keys(billsArray[0]).length === 0)) {
            return reject(new Error('The AI model could not find any bill information in the document.'));
          }

          const validBills = billsArray.filter(
            (bill) => bill && bill.vendorName && bill.billDate && bill.totalAmount && bill.apartment
          );

          if (validBills.length === 0) {
            return reject(new Error('Extracted data is missing required fields like vendor, date, amount, or apartment/address.'));
          }

          resolve(validBills);
        } catch (error) {
          reject(error);
        }
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      reject(new Error('Failed to proxy request to Gemini API.'));
    });

    proxyReq.write(requestBody);
    proxyReq.end();
  });
}

module.exports = { extractBillDataFromPdfWithGemini };
