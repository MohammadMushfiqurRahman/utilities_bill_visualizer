import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BillData } from '../types';

interface VendorChartProps {
  bills: BillData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const VendorChart: React.FC<VendorChartProps> = ({ bills }) => {
  const vendorData = bills.reduce((acc, bill) => {
    const vendor = bill.vendorName || 'Unknown';
    if (!acc[vendor]) {
      acc[vendor] = 0;
    }
    acc[vendor] += bill.totalAmount;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.keys(vendorData).map((vendor) => ({
    name: vendor,
    value: vendorData[vendor],
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-bold text-slate-700 dark:text-slate-300">Bill Breakdown by Vendor</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VendorChart;
