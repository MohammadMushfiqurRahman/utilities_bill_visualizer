import React from 'react';
import { BillData } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SummaryChartProps {
  bills: BillData[];
}

interface MonthlyData {
  month: string;
  [key: string]: number | string; // Vendor costs
}

const vendorColors: { [key: string]: string } = {
  default: '#8884d8',
  electric: '#facc15', // yellow-400
  water: '#38bdf8', // sky-400
  gas: '#fb923c', // orange-400
  internet: '#4ade80', // green-400
  garbage: '#6b7280', // gray-500
};

const getColorForVendor = (vendorName: string): string => {
  const lowerVendor = vendorName.toLowerCase();
  if (
    lowerVendor.includes('electric') ||
    lowerVendor.includes('power') ||
    lowerVendor.includes('pge')
  )
    return vendorColors.electric;
  if (lowerVendor.includes('water')) return vendorColors.water;
  if (lowerVendor.includes('gas')) return vendorColors.gas;
  if (
    lowerVendor.includes('garbage') ||
    lowerVendor.includes('recology') ||
    lowerVendor.includes('waste')
  )
    return vendorColors.garbage;
  if (
    lowerVendor.includes('internet') ||
    lowerVendor.includes('comcast') ||
    lowerVendor.includes('verizon')
  )
    return vendorColors.internet;
  return vendorColors[vendorName] || vendorColors.default;
};

const SummaryChart: React.FC<SummaryChartProps> = ({ bills }) => {
  const data = React.useMemo(() => {
    const monthlyTotals: { [key: string]: MonthlyData } = {};
    const vendors = new Set<string>();

    bills.forEach((bill) => {
      try {
        const date = new Date(bill.billDate + 'T00:00:00');
        const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });

        if (!monthlyTotals[month]) {
          monthlyTotals[month] = { month };
        }

        const vendorName = bill.vendorName || 'Other';
        vendors.add(vendorName);

        if (!monthlyTotals[month][vendorName]) {
          monthlyTotals[month][vendorName] = 0;
        }

        (monthlyTotals[month][vendorName] as number) += bill.totalAmount;
      } catch (e) {
        console.warn(`Could not parse date for bill: ${bill.id}`, bill.billDate);
      }
    });

    return {
      chartData: Object.values(monthlyTotals),
      vendorKeys: Array.from(vendors),
    };
  }, [bills]);

  if (!data.chartData.length) {
    return <div className="p-8 text-center text-slate-500">No data to display in chart.</div>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data.chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis
            dataKey="month"
            stroke="rgb(100 116 139)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgb(100 116 139)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
            contentStyle={{
              background: 'rgb(255 255 255 / 0.8)',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)',
            }}
          />
          <Legend iconSize={10} />
          {data.vendorKeys.map((vendor) => (
            <Bar
              key={vendor}
              dataKey={vendor}
              stackId="a"
              fill={getColorForVendor(vendor)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;
