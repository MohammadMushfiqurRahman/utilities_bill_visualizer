import React, { useState } from 'react';
import { BillData } from '../types';
import BillEditor from './BillEditor';

interface ReviewBillsModalProps {
  bills: BillData[];
  onApprove: (approvedBills: BillData[]) => void;
  onDiscard: () => void;
}

const ReviewBillsModal: React.FC<ReviewBillsModalProps> = ({ bills, onApprove, onDiscard }) => {
  const [editingBill, setEditingBill] = useState<BillData | null>(null);
  const [internalBills, setInternalBills] = useState<BillData[]>(bills);

  const handleEdit = (bill: BillData) => {
    setEditingBill(bill);
  };

  const handleSave = (updatedBill: BillData) => {
    setInternalBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
    setEditingBill(null);
  };

  const handleCancelEdit = () => {
    setEditingBill(null);
  };

  const handleApprove = () => {
    onApprove(internalBills);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-xl dark:bg-slate-800">
        <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-200">Review Extracted Bills</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Review the extracted bill information below. You can edit each bill before approving.
        </p>
        <div className="max-h-[60vh] overflow-y-auto">
          <ul className="space-y-4">
            {internalBills.map((bill) => (
              <li key={bill.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Vendor</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bill.vendor}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bill.billDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">${bill.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleEdit(bill)}
                      className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onDiscard}
            className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Discard
          </button>
          <button
            onClick={handleApprove}
            className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Approve All
          </button>
        </div>
      </div>
      {editingBill && (
        <BillEditor
          bill={editingBill}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default ReviewBillsModal;
