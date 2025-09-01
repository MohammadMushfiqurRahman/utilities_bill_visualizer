import React from 'react';

function BillTable({ bills }) {
  // This component will fetch and display bill data in a table.
  return (
    <div>
      <h2>Bill Details</h2>
      {bills.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.date}</td>
                <td>${bill.amount.toFixed(2)}</td>
                <td>{bill.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bills to display yet. Upload a PDF to get started!</p>
      )}
    </div>
  );
}

export default BillTable;