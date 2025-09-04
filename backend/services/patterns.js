module.exports = {
  amountDue: [/Amount Due: \$([\d.]+)/, /Total Amount: \$([\d.]+)/],
  dueDate: [/Due Date: (\d{2}\/\d{2}\/\d{4})/, /Payment Due: (\d{2}\/\d{2}\/\d{4})/],
  usage: [/Usage: ([\d.]+) kWh/, /Total Usage: ([\d.]+) kWh/],
};
