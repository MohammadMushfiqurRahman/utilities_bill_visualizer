export interface BillData {
  id: string;
  vendorName: string;
  billDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  totalAmount: number;
  usage: {
    value: number;
    unit: string;
  };
  accountNumber: string;
  apartment: string; // e.g., "Apt 101" or "Service Address"
  breakdown?: {
    description: string;
    amount: number;
  }[];
}
