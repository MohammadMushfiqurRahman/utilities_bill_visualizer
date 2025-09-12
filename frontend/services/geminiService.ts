import { GoogleGenAI, Type } from '@google/genai';

if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable not set');
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const billSchema = {
  type: Type.OBJECT,
  properties: {
    vendorName: {
      type: Type.STRING,
      description: "The name of the utility provider (e.g., 'PG&E', 'City Water', 'Recology').",
    },
    apartment: {
      type: Type.STRING,
      description:
        "The apartment, unit number, or service address if present (e.g., 'Apt 101', 'Unit B', '123 Main St'). If not present, use the account holder's name or another unique identifier.",
    },
    billDate: {
      type: Type.STRING,
      description: 'The date the bill was issued in YYYY-MM-DD format.',
    },
    dueDate: {
      type: Type.STRING,
      description: 'The date the payment is due in YYYY-MM-DD format.',
    },
    totalAmount: {
      type: Type.NUMBER,
      description: 'The total amount due on the bill.',
    },
    usage: {
      type: Type.OBJECT,
      properties: {
        value: {
          type: Type.NUMBER,
          description:
            'The numerical value of the primary consumption (e.g., 545.0, 7.5). If no usage is listed (e.g. for garbage), this can be 0.',
        },
        unit: {
          type: Type.STRING,
          description:
            "The unit of consumption (e.g., 'kWh', 'Gallons', 'Therms'). If no unit, provide a descriptor like 'Service'.",
        },
      },
      required: ['value', 'unit'],
    },
    accountNumber: {
      type: Type.STRING,
      description: "The customer's account number, often labeled 'Account Number' or similar.",
    },
    breakdown: {
      type: Type.ARRAY,
      description:
        "A list of line items from the bill, including their description and amount. For example, 'Previous Balance', 'Electric Charges', 'Taxes'. If not present, return an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: 'The description of the charge or line item.',
          },
          amount: {
            type: Type.NUMBER,
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
  type: Type.ARRAY,
  items: billSchema,
};

export async function extractBillDataFromPdf(pdfBase64: string) {
  try {
    const pdfPart = {
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64,
      },
    };

    const textPart = {
      text: "This PDF may contain one or more utility bills, potentially for different apartments or service addresses. For each distinct bill found, extract the utility bill information. Provide details like vendor name, apartment/unit number or service address, bill date, due date, total amount, consumption usage, and account number. Also, extract a detailed breakdown of charges or line items, including the description and amount for each. If no breakdown is available, provide an empty array for the breakdown. Return the result as a JSON array of objects. Ensure dates are in YYYY-MM-DD format. If a bill is for something like garbage collection, usage value can be 0 and unit can be 'Service'.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [pdfPart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: billListSchema,
      },
    });

    const jsonText = response.text.trim();
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse JSON response from AI:', jsonText);
      throw new Error(
        'Could not extract data from the PDF. The AI model returned a malformed response.'
      );
    }

    // Ensure we have an array to work with. If model returns a single object for a single bill, wrap it.
    const billsArray = Array.isArray(parsedData) ? parsedData : [parsedData];

    if (
      billsArray.length === 0 ||
      (billsArray.length === 1 && Object.keys(billsArray[0]).length === 0)
    ) {
      throw new Error('The AI model could not find any bill information in the document.');
    }

    const validBills = billsArray.filter(
      (bill) => bill && bill.vendorName && bill.billDate && bill.totalAmount && bill.apartment
    );

    if (validBills.length === 0) {
      throw new Error(
        'Extracted data is missing required fields like vendor, date, amount, or apartment/address.'
      );
    }

    return validBills;
  } catch (error) {
    console.error('Error processing PDF with Gemini API:', error);
    if (error instanceof Error && error.message.includes('400')) {
      throw new Error(
        'The provided file does not appear to be a valid or readable utility bill. Please try another file.'
      );
    }
    // Re-throw specific errors to be caught in the UI
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Could not extract data from the PDF. The AI model might have had trouble understanding this document's format."
    );
  }
}
